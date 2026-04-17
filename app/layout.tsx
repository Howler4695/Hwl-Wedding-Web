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

const OG_IMAGE =
  "https://hwl-wedding-photos.s3.us-east-2.amazonaws.com/gallery/web/front_pic_2.jpg";

export const metadata: Metadata = {
  metadataBase: new URL("https://thehowles.love"),
  title: "Howle Wedding",
  description:
    "Dedicated to the union between Hannah Kounter and Hayden Howle.",
  openGraph: {
    type: "website",
    url: "https://thehowles.love",
    siteName: "Howle Wedding",
    title: "Hannah & Hayden's Wedding",
    description: "May 16, 2026 · Saint Francisville, Louisiana",
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 600,
        height: 600,
        alt: "Hannah and Hayden",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hannah & Hayden's Wedding",
    description: "May 16, 2026 · Saint Francisville, Louisiana",
    images: [OG_IMAGE],
  },
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
