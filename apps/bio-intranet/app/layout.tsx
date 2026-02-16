
import "./globals.css";
import { Inter } from "next/font/google"; // Using Inter as the premium font
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
    title: "Bio Intranet",
    description: "Internal portal for Bio Herp Science Platform",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased",
                inter.variable
            )}>
                {children}
            </body>
        </html>
    );
}
