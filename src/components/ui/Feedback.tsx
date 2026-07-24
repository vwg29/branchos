"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface Toast { id: number; message: string; kind: "success" | "error" | "info" }
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
      <div className="fixed inset-x-0 top-4 z-[70] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`glass-surface rounded-xl px-5 py-3 text-sm font-medium animate-fade-in pointer-events-auto shadow-glass-elevated border ${
              t.kind === "error" ? "border-rose/30 text-rose" : t.kind === "info" ? "border-violet/30 text-violet" : "border-aura/30 text-aura"
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
    <div className={`relative overflow-hidden rounded-2xl bg-surface ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl p-10 text-center animate-fade-in">
      <div className="h-14 w-14 rounded-xl bg-aura-soft animate-floaty flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00F5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
      <p className="text-lg font-medium text-white">{title}</p>
      {hint && <p className="text-sm text-text-muted">{hint}</p>}
      {action}
    </div>
  );
}
