import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { GradientMesh } from "@/components/brand/gradient-mesh";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const displaySerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Climatifai — Inteligencia climática agrícola",
    template: "%s · Climatifai",
  },
  description:
    "Compara patrones climáticos históricos con condiciones actuales y proyectadas para los cultivos y regiones que te importan.",
  metadataBase: new URL("https://climatifai.example"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-419"
      suppressHydrationWarning
      className={`${displaySerif.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-svh bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <GradientMesh />
          <TooltipProvider delayDuration={200}>
            <div className="relative flex min-h-svh flex-col">{children}</div>
          </TooltipProvider>
          <Toaster richColors closeButton position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
