import type { Metadata } from "next";
import { LangProvider } from "@/lib/LangContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://loverspick.com"),
  title: "LoversPick — Seoul Travel Concierge | No Tourist Traps",
  description:
    "Real locals help you navigate Seoul in real time via chat. Price checks, restaurant orders, directions, reservations, and emergency support — all from someone who actually lives here.",
  keywords: [
    "Seoul travel",
    "Seoul concierge",
    "tourist trap prevention",
    "Korea travel help",
    "Seoul local guide",
    "real-time chat concierge",
  ],
  openGraph: {
    title: "LoversPick — No Tourist Traps. No Rip-offs. Just Seoul, Done Right.",
    description:
      "Chat with real Seoul locals in real time. Price checks, restaurant help, directions, reservations & emergency support.",
    url: "https://loverspick.com",
    siteName: "LoversPick",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LoversPick Seoul Concierge" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoversPick — Seoul Travel Concierge",
    description: "Real locals. Real-time chat. No tourist traps in Seoul.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
