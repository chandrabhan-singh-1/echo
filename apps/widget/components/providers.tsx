"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Provider } from "jotai";

const convexClient = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL! ?? ""
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convexClient}>
      <NextThemesProvider
        attribute="class"
        // defaultTheme="system"
        enableSystem={false}
        disableTransitionOnChange
        enableColorScheme
      >
        <Provider>{children}</Provider>
      </NextThemesProvider>
    </ConvexProvider>
  );
}
