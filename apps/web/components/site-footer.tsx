import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-wide grid gap-14 px-5 py-20 md:px-10 lg:grid-cols-[1.1fr_.8fr_1.3fr] lg:px-16">
        <div>
          <Logo light />
          <p className="mt-7 max-w-sm text-sm leading-7 text-white/60">
            Professionally managed vacation and corporate rentals, made personal from booking to
            departure.
          </p>
          <div className="mt-7 flex gap-3">
            <a
              href="https://www.instagram.com/thebaysuites/"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-champagne"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/the-bay-suites-to"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-champagne"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <div className="mt-6 grid gap-3 text-sm text-white/65">
            <Link href="/stays" className="hover:text-white">Find a stay</Link>
            <Link href="/corporate-rentals" className="hover:text-white">Corporate rentals</Link>
            <Link href="/owners" className="hover:text-white">Property management</Link>
            <Link href="/property-assessment" className="hover:text-white">Free assessment</Link>
            <Link href="/blog" className="hover:text-white">Journal</Link>
            <Link href="/cancellation-policy" className="hover:text-white">Cancellation policy</Link>
            <Link href="/portal" className="hover:text-white">Guest portal</Link>
            <Link href="/owner-portal" className="hover:text-white">Admin portal</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <div className="mt-6 space-y-5 text-sm leading-6 text-white/65">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-champagne" />
              <span>67 Mowat Ave, Toronto, ON M6K 3E3, Canada</span>
            </p>
            <p className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-champagne" />
              <span>
                Unit 1501, 15th Floor, Bengal Eco Intelligent Park, EM-3, Sector V, Salt Lake City,
                Kolkata 700091
              </span>
            </p>
            <a href="tel:+18777211311" className="flex gap-3 hover:text-white">
              <Phone className="h-4 w-4 text-champagne" /> +1 (877) 721-1311
            </a>
            <a href="mailto:admin@thebaysuites.com" className="flex gap-3 hover:text-white">
              <Mail className="h-4 w-4 text-champagne" /> admin@thebaysuites.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/35">
        © {new Date().getFullYear()} The Bay Suites. All rights reserved.
      </div>
    </footer>
  );
}
