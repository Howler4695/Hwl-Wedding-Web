import type { Metadata } from "next";
import { Cormorant_Garamond, Quicksand } from "next/font/google";
import "./globals.css";
import { NavHeader } from "@/components";

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
        className={`${cormorant.variable} ${quicksand.variable} antialiased`}
      >
        <div className="min-h-screen bg-background">
          <NavHeader />
          <main className="min-h-screen overflow-y-auto sm:pt-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
