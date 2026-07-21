"use client";
import { useEffect, useState } from "react";

// Surfaces runtime JS errors as a red bar at the top of the screen.
// Especially useful when developing from mobile without dev tools (guide 5.3).
export function OnScreenErrorCatcher() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const onError = (e: ErrorEvent) => setMsg(e.message || "Runtime error");
    const onRejection = (e: PromiseRejectionEvent) =>
      setMsg(String(e.reason?.message ?? e.reason ?? "Unhandled rejection"));
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (!msg) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-[100] bg-rose px-4 py-2 text-center text-sm text-white">
      <span className="font-mono">{msg}</span>
      <button className="ms-3 underline" onClick={() => setMsg(null)}>dismiss</button>
    </div>
  );
}
