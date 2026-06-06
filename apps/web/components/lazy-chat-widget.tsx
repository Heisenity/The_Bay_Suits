"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(() => import("./chat-widget").then((module) => module.ChatWidget), {
  ssr: false
});

export function LazyChatWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const browser = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (browser.requestIdleCallback) {
      const id = browser.requestIdleCallback(() => setReady(true), { timeout: 2200 });
      return () => browser.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return ready ? <ChatWidget /> : null;
}
