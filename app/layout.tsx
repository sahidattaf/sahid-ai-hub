import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Sahid AI Hub | AI command center",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
