import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemedToastContainer } from "@/components/themed-toast-container";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";
import { AppLoader } from "@/components/app-loader";

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
          <AuthProvider>
            <ThemedToastContainer />
            <AppLoader>
              <Suspense fallback={null}>{children}</Suspense>
            </AppLoader>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}