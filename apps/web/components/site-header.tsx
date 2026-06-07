"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, Linkedin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const mobileMenu = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed inset-0 z-[220] lg:hidden"
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/50 backdrop-blur-[3px]"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-[min(90vw,420px)] flex-col overflow-hidden border-l border-white/10 bg-ink text-white shadow-[0_28px_80px_rgba(15,31,53,.42)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <p className="eyebrow text-champagne/90">Menu</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 p-2.5 text-white/80 transition hover:border-white/30 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto overscroll-contain px-5 pb-7 pt-6">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(201,177,124,0.18),transparent_58%)]" />
              <div className="relative">
                <p className="text-sm leading-6 text-white/68">
                  Every stay, service and portal action from desktop is available here too, tuned cleanly for mobile.
                </p>
              </div>
              <div className="relative mt-6 grid gap-3">
                <Link
                  href="/portal"
                  onClick={() => setOpen(false)}
                  className="rounded-[1.5rem] border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[.16em] text-champagne/90">Current guest</span>
                  <strong className="mt-2 block font-display text-[1.45rem] leading-none">Guest portal</strong>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm text-white/70">
                    Open reservation tools <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link
                  href="/stays"
                  onClick={() => setOpen(false)}
                  className="rounded-[1.5rem] bg-champagne px-5 py-4 text-ink"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[.16em] text-ink/55">Ready to stay?</span>
                  <strong className="mt-2 block font-display text-[1.45rem] leading-none">Book now</strong>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm text-ink/70">
                    Browse residences <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
              <div className="relative mt-7 divide-y divide-white/10 rounded-[1.8rem] border border-white/10 bg-white/5 px-4">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + index * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between py-4"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-champagne/80">0{index + 1}</span>
                        <span className="font-display text-[1.45rem] capitalize leading-none">{link.label}</span>
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-white/30 transition group-hover:text-champagne" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/58">
                <span>Guest support</span>
                <span className="h-1 w-1 rounded-full bg-champagne/70" />
                <a href="tel:+18777211311" className="transition hover:text-white">
                  +1 (877) 721-1311
                </a>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-white/48">
                <a href="mailto:admin@thebaysuites.com" className="transition hover:text-white">
                  admin@thebaysuites.com
                </a>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/thebaysuites/" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
                  <a href="https://www.linkedin.com/company/the-bay-suites-to" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-[#fbfaf7]/95 backdrop-blur-xl">
      <div className="container-wide relative flex h-[76px] items-center justify-between gap-4 px-4 sm:px-5 md:px-10 lg:px-16">
        <div className="min-w-0 max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-10.5rem)] lg:max-w-none">
          <div className="sm:hidden">
            <Logo compact />
          </div>
          <div className="hidden sm:block">
            <Logo compact={false} />
          </div>
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
        <div className="absolute right-4 flex items-center gap-2 md:right-8 lg:hidden">
          <Link
            href="/stays"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "h-9 rounded-full px-3.5 text-[0.64rem] uppercase tracking-[0.12em] sm:h-10 sm:px-4 sm:text-[0.7rem]"
            )}
          >
            Book now
          </Link>
          <button
            type="button"
            className="rounded-full border border-ink/10 p-2.5"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {mounted ? createPortal(mobileMenu, document.body) : null}
    </header>
  );
}
