"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convexClient = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL! ?? ""
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      <NextThemesProvider
        attribute="class"
        // defaultTheme="system"
        enableSystem={false}
        disableTransitionOnChange
        enableColorScheme
        forcedTheme="light"
      >
        {children}
      </NextThemesProvider>
    </ConvexProviderWithClerk>
  );
}

{
}
