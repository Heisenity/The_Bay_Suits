import Link from "next/link";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className={cn("flex min-w-0 items-center gap-2.5 sm:gap-3", light ? "text-white" : "text-ink")}>
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full border sm:h-10 sm:w-10",
          light ? "border-white/40" : "border-champagne"
        )}
      >
        <Crown className="h-4 w-4 text-champagne" strokeWidth={1.5} />
      </span>
      {!compact && (
        <span className="min-w-0 leading-none">
          <span className="block truncate font-display text-[0.92rem] uppercase tracking-[0.08em] sm:text-[1.42rem] sm:tracking-[0.12em]">
            The Bay Suites
          </span>
          <span className="mt-1 hidden text-[0.48rem] font-bold uppercase tracking-[0.31em] text-champagne sm:block">
            Vacation & Corporate Rentals
          </span>
        </span>
      )}
    </Link>
  );
}
