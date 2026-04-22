import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/sections/Header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JK Constructions | Premium Construction Services",
  description: "Modern and professional construction services for residential, commercial, and interior projects.",
  icons: {
    icon: "/Favicon Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen antialiased bg-background text-foreground`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
