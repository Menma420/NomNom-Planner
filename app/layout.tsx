import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import NavBar from "@/components/navbar";
import ReactQueryClientProvider from "@/components/react-query-client-provider";

// Configure Google Fonts for consistent typography
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// App metadata for SEO and browser tabs
export const metadata: Metadata = {
  title: "NomNomPlanner",
  description: "Created by Menma",
};

// Root layout component - wraps entire app with providers and global structure
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ReactQueryClientProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >  
        <NavBar />
        <div className="max-w-7xl mx-auto pt-16 p-4 min-h-screen">
        {children}
        </div>
      </body>
    </html>
    </ReactQueryClientProvider>
    </ClerkProvider>
  );
}
