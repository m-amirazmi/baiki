import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/contexts/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import AuthWatcher from "@/components/auth-watcher";
import { ThemeProvider } from "@/contexts/theme";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baiki",
  description:
    "Baiki RMS - Repair Management System for Consumer Electronics Repair Shop",
};

// Here will check the
// 1. Auth
// 2. Roles

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ThemeProvider>
        <ConvexClientProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ConvexClientProvider>
      </ThemeProvider>
    </ConvexAuthNextjsServerProvider>
  );
}

const LayoutWrapper = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", geistSans.variable, geistMono.variable)}
      >
        {children}
      </body>
    </html>
  );
};
