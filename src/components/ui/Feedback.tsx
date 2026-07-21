"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface Toast { id: number; message: string; kind: "success" | "error" }
interface ToastApi { notify: (message: string, kind?: Toast["kind"]) => void }

const ToastCtx = createContext<ToastApi>({ notify: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`glass-surface rounded-pill px-5 py-2.5 text-sm ${
              t.kind === "error" ? "text-rose" : "text-aqua"
            }`}
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/5 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="glass-surface flex flex-col items-center gap-3 rounded-squircle p-10 text-center">
      <div className="h-14 w-14 rounded-squircle bg-gradient-to-tr from-aqua/40 to-violet/40 animate-floaty" />
      <p className="text-lg font-medium text-white">{title}</p>
      {hint && <p className="text-sm text-white/60">{hint}</p>}
      {action}
    </div>
  );
}
