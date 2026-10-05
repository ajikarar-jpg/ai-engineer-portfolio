import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PortfolioAssistant } from "@/components/portfolio-assistant/PortfolioAssistant";
import { Providers } from "@/components/Providers";
import { TechnicalBackdrop } from "@/components/TechnicalBackdrop";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function siteMetadata(): Pick<Metadata, "metadataBase"> {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return {};
  try {
    return { metadataBase: new URL(value) };
  } catch {
    return {};
  }
}

export const metadata: Metadata = {
  ...siteMetadata(),
  title: {
    default: `${site.name} — AI Engineer`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "AI engineer",
    "AI systems",
    "business automation",
    "custom software",
    "business dashboards",
    "SaaS",
  ],
  openGraph: {
    title: `${site.name} — AI Engineer`,
    description: site.description,
    type: "website",
    locale: "en_US",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — AI Engineer`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#07080c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "AI Engineer",
  email: site.email,
  description: site.description,
  sameAs: [site.github],
  knowsAbout: [
    "Artificial intelligence",
    "Workflow automation",
    "Custom software",
    "Dashboards",
    "SaaS applications",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <TechnicalBackdrop />
        <Providers>
          <Navbar />
          <main id="content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <PortfolioAssistant />
        </Providers>
      </body>
    </html>
  );
}
