"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexClient = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL! ?? ""
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convexClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </ConvexProvider>
  );
}
