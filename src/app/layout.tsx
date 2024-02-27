import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/main.css";

require('dotenv').config();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Package Dashboard"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      {children}
      </body>
    </html>
  );
}
