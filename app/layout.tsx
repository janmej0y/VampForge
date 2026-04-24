import type { Metadata } from "next";
import localFont from "next/font/local";
import { RootShell } from "@/components/root-shell";
import "./globals.css";

const headingFont = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-heading",
  weight: "100 900",
});

const bodyFont = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-body",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "VampForge",
    template: "%s | VampForge",
  },
  description: "Forge Your Developer Identity with a modern developer career platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
