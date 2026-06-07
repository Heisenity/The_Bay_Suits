"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, Linkedin, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./logo";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/stays", label: "Find a stay" },
  { href: "/services", label: "Services" },
  { href: "/service-areas", label: "Service areas" },
  { href: "/corporate-rentals", label: "Corporate" },
  { href: "/owners", label: "For owners" },
  { href: "/owner-portal", label: "Admin portal" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-[#fbfaf7]/95 backdrop-blur-xl">
      <div className="container-wide relative flex h-[76px] items-center justify-between gap-4 overflow-hidden px-4 sm:px-5 md:px-10 lg:px-16">
        <div className="min-w-0 max-w-[calc(100%-3.75rem)] lg:max-w-none">
          <Logo />
        </div>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-[0.09em] text-ink/70 transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/portal" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Guest portal
          </Link>
          <Link href="/stays" className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
            Book now
          </Link>
        </div>
        <button className="absolute right-4 p-2 md:right-8 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-[76px] z-[60] overflow-y-auto bg-ink px-5 py-8 text-white lg:hidden"
          >
            <div className="container-wide flex min-h-full flex-col">
              <p className="eyebrow">Explore The Bay Suites</p>
              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + index * 0.055 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between py-4 font-display text-3xl sm:text-4xl"
                    >
                      <span><span className="mr-4 align-middle text-[10px] font-sans text-champagne">0{index + 1}</span>{link.label}</span>
                      <ArrowUpRight className="h-5 w-5 text-white/30 transition group-hover:text-champagne" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto grid gap-4 pt-8 sm:grid-cols-2">
                <Link href="/portal" onClick={() => setOpen(false)} className="rounded-2xl bg-white p-5 text-ink">
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-ink/40">Current guest</span>
                  <strong className="mt-2 block font-display text-2xl">Open guest portal</strong>
                </Link>
                <Link href="/stays" onClick={() => setOpen(false)} className="rounded-2xl bg-champagne p-5 text-ink">
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-ink/50">Ready to stay?</span>
                  <strong className="mt-2 block font-display text-2xl">Find a residence</strong>
                </Link>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/45">
                <a href="tel:+18777211311">+1 (877) 721-1311</a>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/thebaysuites/" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
                  <a href="https://www.linkedin.com/company/the-bay-suites-to" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
