import "@/lib/env";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RIVUS OS",
  description: "Governance & enforcement engine za SPV strukture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body className={`${inter.variable} antialiased`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif' }}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
