import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Quicksand,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Howle Wedding",
  description:
    "Dedicated to the union between Hannah Kounter and Hayden Howle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${quicksand.variable} antialiased`}
      >
        <div className="min-h-screen bg-toile-center">{children}</div>
      </body>
    </html>
  );
}
