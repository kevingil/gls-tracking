import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

require('dotenv').config();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GLS Tracking",
  description: "Tracking for GLS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <main className="{inter.className} min-h-screen bg-white text-black">{children}</main>
    </html>
  );
}
