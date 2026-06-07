"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
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
  const socket = useRef<Socket | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const joinedConversation = useRef("");

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
    client.on("message", (message: ChatMessage) => {
      if (message.conversationId !== conversationId) return;
      setSending(false);
      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });
    });

    socket.current = client;
    return () => {
      joinedConversation.current = "";
      client.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
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
    socket.current?.emit("message", message);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = String(form.get("message") || "");
    if (!text) return;
    event.currentTarget.reset();
    sendMessage(text);
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="mt-1 text-xs text-ink/45">
            {connected ? "Live conversation connected" : "Connecting to live conversation"}
          </p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${connected ? "bg-emerald-50 text-emerald-700" : "bg-linen text-ink/55"}`}>
          <i className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-champagne"}`} />
          {connected ? "Realtime" : "Syncing"}
        </span>
      </div>

      <div className="max-h-[420px] min-h-[280px] space-y-3 overflow-y-auto bg-linen/75 p-5">
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
                <div
                  className={`inline-block max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    mine
                      ? "bg-ink text-white"
                      : teamMessage
                        ? "bg-white text-ink shadow-sm"
                        : "bg-champagne/15 text-ink"
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
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-ink/8 p-3">
        <input
          name="message"
          placeholder={currentAuthor === "guest" ? "Ask about arrival, access or your stay…" : "Reply to this guest…"}
          autoComplete="off"
          disabled={sending}
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
