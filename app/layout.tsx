import type { Metadata } from "next";
import { IBM_Plex_Serif, Mona_Sans, Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  variable: "--font-ibm-plex-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

const monsaSans = Mona_Sans({
  variable: "--font-monsa-sans",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Read Buddy",
  description: "Transform your book into imteractive AI conversations. Upload PDFs and chat with your books using voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("relative", "h-full", "antialiased", ibmPlexSerif.variable, monsaSans.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
