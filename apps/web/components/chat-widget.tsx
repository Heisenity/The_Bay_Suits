"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { io, type Socket } from "socket.io-client";

type Message = {
  id: string;
  author: "guest" | "team";
  text: string;
  createdAt: string;
  suggestions?: string[];
};

const initialSuggestions = ["Find a suite", "How much is a stay?", "Check-in information"];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      author: "team",
      text: "Welcome to The Bay Suites. I can help with bookings, pricing, locations, check-in, and guest support.",
      createdAt: new Date().toISOString(),
      suggestions: initialSuggestions
    }
  ]);
  const socket = useRef<Socket | null>(null);
  const messagesEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const client = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true
    });
    client.on("connect", () => {
      setConnected(true);
      client.emit("join", { conversationId: "website-lobby" });
    });
    client.on("disconnect", () => setConnected(false));
    client.on("assistant:typing", ({ active }: { active: boolean }) => setTyping(active));
    client.on("message", (message: Message) => {
      setSending(false);
      setTyping(false);
      setMessages((current) => [...current, message]);
    });
    socket.current = client;
    return () => { client.disconnect(); };
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  function sendMessage(text: string) {
    const cleanText = text.trim();
    if (!cleanText || sending) return;

    const message: Message = {
      id: crypto.randomUUID(),
      author: "guest",
      text: cleanText,
      createdAt: new Date().toISOString()
    };
    setSending(true);
    setMessages((current) => [
      ...current.map((item) => ({ ...item, suggestions: undefined })),
      message
    ]);

    if (connected && socket.current) {
      socket.current.emit("message", { ...message, conversationId: "website-lobby" });
      return;
    }

    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setSending(false);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          author: "team",
          text: "I’m having trouble connecting to live support. Please call +1 (877) 721-1311 or email admin@thebaysuites.com.",
          createdAt: new Date().toISOString(),
          suggestions: initialSuggestions
        }
      ]);
    }, 700);
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
    <div className="fixed bottom-5 right-5 z-[70]">
      {open && (
        <div className="mb-3 flex h-[520px] w-[calc(100vw-40px)] max-w-[380px] flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white shadow-[0_30px_90px_rgba(15,31,53,.25)]">
          <div className="flex items-center justify-between bg-ink p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-champagne"><Bot className="h-5 w-5" /></span>
              <div><p className="font-display text-2xl">Bay support</p><p className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-white/50"><span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-champagne"}`} /> {connected ? "Assistant online" : "Connecting"}</p></div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-linen p-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.author === "guest" ? "ml-auto bg-ink text-white" : "bg-white text-ink shadow-sm"}`}>
                  {message.text}
                  <span className={`mt-1 block text-[9px] ${message.author === "guest" ? "text-white/40" : "text-ink/35"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {message.author === "team" && message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        disabled={sending}
                        className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition hover:border-champagne hover:bg-champagne/10 disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex w-fit items-center gap-1 rounded-2xl bg-white px-4 py-4 shadow-sm" aria-label="Assistant is typing">
                {[0, 1, 2].map((dot) => <span key={dot} className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink/35" style={{ animationDelay: `${dot * 140}ms` }} />)}
              </div>
            )}
            <div ref={messagesEnd} />
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-ink/10 p-3">
            <input name="message" placeholder="Ask about your stay..." autoComplete="off" disabled={sending} className="min-w-0 flex-1 rounded-full bg-linen px-4 text-sm outline-none disabled:opacity-60" />
            <button disabled={sending} className="grid h-11 w-11 place-items-center rounded-full bg-champagne text-ink disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}
      <button onClick={() => setOpen((value) => !value)} className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-ink text-white shadow-soft transition hover:-translate-y-1" aria-label="Open chat">
        {open ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
}
