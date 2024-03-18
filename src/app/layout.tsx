import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/main.css";

require('dotenv').config();

// Value is read in CSS
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal'], 
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Package Dashboard"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
