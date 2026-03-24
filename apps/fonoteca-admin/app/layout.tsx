import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });


export const metadata: Metadata = {
  title: "Fonoteca Admin - Platform",
  description: "Panel administrativo para la fonoteca de especies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
