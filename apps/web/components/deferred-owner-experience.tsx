"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const OwnerExperience = dynamic(() => import("./owner-experience").then((module) => module.OwnerExperience), {
  ssr: false,
  loading: () => <div className="min-h-[680px] animate-pulse bg-ink" />
});

export function DeferredOwnerExperience() {
  const anchor = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = anchor.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={anchor} className="min-h-[680px] bg-ink">
      {ready ? <OwnerExperience /> : <div className="min-h-[680px] bg-ink" aria-hidden="true" />}
    </div>
  );
}
