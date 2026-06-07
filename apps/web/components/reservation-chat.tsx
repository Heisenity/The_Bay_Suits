"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { io, type Socket } from "socket.io-client";
import { getReservationMessages } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

type ReservationChatProps = {
  confirmation: string;
  conversationId: string;
  currentAuthor: "guest" | "admin";
  emptyState: string;
};

export function ReservationChat({
  confirmation,
  conversationId,
  currentAuthor,
  emptyState
}: ReservationChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [partnerTyping, setPartnerTyping] = useState(false);
  const socket = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const joinedConversation = useRef("");
  const typingTimeout = useRef<number | null>(null);
  const previousMessageCount = useRef(0);
  const quickReplies = currentAuthor === "guest"
    ? ["What time is check-in?", "Can I extend my stay?", "Please share arrival help"]
    : ["Thanks, we are on it.", "Your arrival guide is ready.", "I can help with that now."];

  const title = useMemo(
    () => (currentAuthor === "guest" ? "Message your host" : `Guest conversation · ${confirmation}`),
    [confirmation, currentAuthor]
  );

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    getReservationMessages(confirmation)
      .then((history) => {
        if (!ignore) setMessages(history);
      })
      .catch((reason) => {
        if (!ignore) {
          setMessages([]);
          setError(reason instanceof Error ? reason.message : "We could not load this conversation.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [confirmation]);

  useEffect(() => {
    const client = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true
    });

    client.on("connect", () => {
      setConnected(true);
      if (joinedConversation.current !== conversationId) {
        client.emit("join", { conversationId });
        joinedConversation.current = conversationId;
      }
    });
    client.on("disconnect", () => setConnected(false));
    client.on("typing", (payload: { conversationId: string; author: string; active: boolean }) => {
      if (payload.conversationId !== conversationId || payload.author === currentAuthor) return;
      setPartnerTyping(payload.active);
    });
    client.on("message", (message: ChatMessage) => {
      if (message.conversationId !== conversationId) return;
      setSending(false);
      setPartnerTyping(false);
      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });
    });

    socket.current = client;
    return () => {
      joinedConversation.current = "";
      if (typingTimeout.current) {
        window.clearTimeout(typingTimeout.current);
      }
      client.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    if (!listRef.current) return;
    const behavior =
      loading || previousMessageCount.current === 0 || messages.length <= previousMessageCount.current ? "auto" : "smooth";
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior
    });
    previousMessageCount.current = messages.length;
  }, [messages, loading]);

  function sendMessage(text: string) {
    const cleanText = text.trim();
    if (!cleanText || sending) return;
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId,
      author: currentAuthor,
      text: cleanText,
      createdAt: new Date().toISOString()
    };

    setSending(true);
    setMessages((current) => [...current, message]);
    socket.current?.emit("typing", { conversationId, author: currentAuthor, active: false });
    socket.current?.emit("message", message);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  }

  function updateDraft(nextValue: string) {
    setDraft(nextValue);
    socket.current?.emit("typing", { conversationId, author: currentAuthor, active: nextValue.trim().length > 0 });
    if (typingTimeout.current) {
      window.clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = window.setTimeout(() => {
      socket.current?.emit("typing", { conversationId, author: currentAuthor, active: false });
    }, 1200);
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-ink/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="mt-1 text-xs text-ink/45">
            {connected ? "Live conversation connected" : "Connecting to live conversation"}
          </p>
        </div>
        <span className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${connected ? "bg-emerald-50 text-emerald-700" : "bg-linen text-ink/55"} sm:self-auto`}>
          <i className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-champagne"}`} />
          {connected ? "Realtime" : "Syncing"}
        </span>
      </div>

      <div className="border-b border-ink/8 bg-white px-5 py-3">
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => sendMessage(reply)}
              className="rounded-full border border-ink/10 bg-linen px-3 py-1.5 text-[11px] font-semibold text-ink/70 transition hover:border-champagne/50 hover:bg-champagne/10 hover:text-ink"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={listRef}
        className="max-h-[420px] min-h-[280px] space-y-3 overflow-y-auto overflow-x-hidden bg-[linear-gradient(180deg,rgba(251,250,247,0.65),rgba(243,238,230,0.9))] p-5"
      >
        {loading ? (
          <div className="grid min-h-[240px] place-items-center text-sm text-ink/45">Loading conversation…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : messages.length === 0 ? (
          <div className="grid min-h-[240px] place-items-center rounded-[1.5rem] border border-dashed border-ink/10 bg-white/75 p-8 text-center">
            <div>
              <MessageCircle className="mx-auto h-6 w-6 text-champagne" />
              <p className="mt-3 text-sm text-ink/55">{emptyState}</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const mine = message.author === currentAuthor;
            const teamMessage = message.author !== "guest";

            return (
              <div key={message.id} className={mine ? "text-right" : ""}>
                <p className={`mb-1 text-[10px] font-bold uppercase tracking-[0.12em] ${mine ? "text-ink/35" : "text-ink/30"}`}>
                  {mine ? "You" : message.author === "admin" ? "Admin team" : "Guest"}
                </p>
                <div
                  className={`inline-block max-w-[88%] rounded-[1.35rem] px-4 py-3 text-sm leading-6 ${
                    mine
                      ? "bg-ink text-white shadow-[0_18px_35px_rgba(15,31,53,.16)]"
                      : teamMessage
                        ? "border border-ink/8 bg-white text-ink shadow-sm"
                        : "bg-champagne/18 text-ink"
                  }`}
                >
                  {message.text}
                  <span className={`mt-1 block text-[10px] ${mine ? "text-white/45" : "text-ink/35"}`}>
                    {new Date(message.createdAt).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        {partnerTyping ? (
          <div className="flex items-center gap-2 text-xs text-ink/45">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm">
              <Sparkles className="h-4 w-4 text-champagne" />
            </span>
            <div className="rounded-full bg-white px-3 py-2 shadow-sm">Someone is typing…</div>
          </div>
        ) : null}
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-ink/8 p-3">
        <input
          name="message"
          placeholder={currentAuthor === "guest" ? "Ask about arrival, access or your stay…" : "Reply to this guest…"}
          autoComplete="off"
          disabled={sending}
          value={draft}
          onChange={(event) => updateDraft(event.target.value)}
          className="min-w-0 flex-1 rounded-full bg-linen px-4 py-3 text-sm outline-none disabled:opacity-60"
        />
        <button
          disabled={sending}
          className="grid h-11 w-11 place-items-center rounded-full bg-champagne text-ink transition hover:scale-[1.02] disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
