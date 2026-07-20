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
  keywords: ["game topup", "buy diamonds", "mobile legends topup", "pubg mobile uc", "free fire diamonds", "cambodia game topup", "khqr topup", "ទិញពេជ្រហ្គេម", "បញ្ចូលលុយហ្គេម", "ពេជ្រ Mobile Legends"],
  metadataBase: new URL("https://gwenntopup.store"),
  openGraph: {
    title: "GwennTopup | Fast & Secure Game Top-Up",
    description: "Instant delivery, trusted service, best prices for all your favorite games.",
    url: "https://gwenntopup.store",
    siteName: "GwennTopup",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GwennTopup | Game Top-Up",
    description: "Instant game top up in Cambodia via KhqrPay.",
  }
};

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
        <script src="https://khqr.cc/khqrcc-plugin.js" async></script>
      </body>
    </html>
  );
}
