import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import CommandPalette from "@/components/command-palette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sahid AI Hub | AI command center",
    template: "%s | Sahid AI Hub",
  },
  description:
    "The public front door to Sahid Attaf's AI projects, live apps, repositories, hospitality systems, real estate intelligence, and proof-of-work prototypes.",
  openGraph: {
    title: "Sahid AI Hub | AI command center",
    description:
      "The public front door to Sahid Attaf's AI projects, live apps, repositories, hospitality systems, and proof-of-work prototypes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
