import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat-widget";
import { ScrollProgress } from "@/components/scroll-progress";

export const metadata: Metadata = {
  title: {
    default: "The Bay Suites | Vacation & Corporate Rentals",
    template: "%s | The Bay Suites"
  },
  description:
    "Premium furnished vacation and corporate rentals across our growing international network."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <ScrollProgress />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
