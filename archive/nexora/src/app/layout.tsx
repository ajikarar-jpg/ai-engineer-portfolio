import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/layout/app-shell";
import { SettingsProvider } from "@/components/settings/settings-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeScript = `(function(){try{var stored=localStorage.getItem("nexora-theme");var theme=stored==="light"||stored==="dark"?stored:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(theme==="dark")document.documentElement.classList.add("dark");document.documentElement.style.colorScheme=theme;}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "Nexora",
    template: "%s · Nexora",
  },
  description:
    "Nexora is a business analytics workspace for revenue, customers, orders, and written AI analysis.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <Script id="nexora-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <SettingsProvider>
          <AppShell>{children}</AppShell>
        </SettingsProvider>
      </body>
    </html>
  );
}
