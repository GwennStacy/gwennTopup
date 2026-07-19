import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GwennTopup | Fast & Secure Game Diamond Top-Up",
  description: "Instant delivery, trusted service, best prices. Top up Mobile Legends, Free Fire, PUBG Mobile, and more.",
};

import FloatingWidgets from "@/components/FloatingWidgets";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <FloatingWidgets />
        <script src="https://khqr.cc/khqrcc-plugin.js" async></script>
      </body>
    </html>
  );
}
