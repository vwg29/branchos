"use client";
import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Feedback";
import { OnScreenErrorCatcher } from "@/components/ui/OnScreenErrorCatcher";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <OnScreenErrorCatcher />
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
