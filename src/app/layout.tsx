import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import ConditionalChatWidget from "@/components/ConditionalChatWidget"; // 👈 Remplacement ici

export const metadata: Metadata = {
  metadataBase: new URL("https://flexperformance.fr"),
  title: "FLEX PERFORMANCE | Reprogrammation & Diagnostic (77)",
  description: "Atelier spécialisé en reprogrammation moteur (Stage 1, Stage 2, FlexFuel E85) et diagnostic électronique à Brou-sur-Chantereine.",
  keywords: [
    "reprogrammation moteur Chelles",
    "reprogrammation moteur 77",
    "conversion E85 Brou sur Chantereine",
    "diagnostic electronique auto 77",
    "FlexFuel Seine et Marne",
    "FAP CHELLES",
    "ADBLUE CHELLES",
    "EGR CHELLES",
  ],
  openGraph: {
    title: "FLEX PERFORMANCE - Reprogrammation Moteur",
    description: "Atelier spécialisé en reprogrammation moteur (Stage 1, Stage 2, E85) et diagnostic électronique multimarque.",
    url: "https://flexperformance.fr",
    siteName: "FLEX PERFORMANCE",
    images: [
      {
        url: "/og-image.png?v=5",
        width: 1200,
        height: 630,
        alt: "FLEX PERFORMANCE Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FLEX PERFORMANCE - Reprogrammation Moteur",
    description: "Atelier spécialisé en reprogrammation moteur et diagnostic électronique.",
    images: ["/og-image.png?v=5"],
  },
  icons: { 
    icon: { url: "/favicon.png?v=4", sizes: "180X180", type: "image/png" },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        {/* Google Analytics (GA4) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-0WPVVV3CTM"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0WPVVV3CTM', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="bg-ink text-snow antialiased">
        {children}
        <ConditionalChatWidget /> {/* 👈 Utilisation du composant conditionnel */}
      </body>
    </html>
  );
}