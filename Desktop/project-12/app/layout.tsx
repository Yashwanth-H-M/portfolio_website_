import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroller from "@/components/smooth-scroller";
import CustomCursor from "@/components/ui/custom-cursor";
import AnimatedBackground from "@/components/ui/animated-background";
import Navbar from "@/components/ui/navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yashwanth | Creative Developer",
  description: "Immersive digital experience and portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-cinema-black text-foreground overflow-x-hidden`}
      >
        <SmoothScroller>
          <CustomCursor />
          <AnimatedBackground />
          <Navbar />
          {children}
        </SmoothScroller>
      </body>
    </html>
  );
}
