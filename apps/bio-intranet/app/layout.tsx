
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
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
        <ClerkProvider>
            <html lang="en">
                <body className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    inter.variable
                )}>
                    <header className="flex justify-end p-4 border-b">
                        <SignedOut>
                            <SignInButton />
                            <SignUpButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </header>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
