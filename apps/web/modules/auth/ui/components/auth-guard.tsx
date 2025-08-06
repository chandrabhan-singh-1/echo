"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { AuthLayout } from "@/modules/auth/ui/layout/auth-layout";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <p>Loading...</p>
        </AuthLayout>
      </AuthLoading>
      <Authenticated>
        <AuthLayout>{children}</AuthLayout>
      </Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
    </>
  );
};
