import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemedToastContainer } from "@/components/themed-toast-container"

export const metadata: Metadata = {
  title: "ShipGlobal - Sistema de Gestión de Envíos",
  description: "Plataforma profesional para gestión de envíos internacionales",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light">
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
          <ThemedToastContainer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
