"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error?: (Error & { digest?: string }) | null;
  reset: () => void;
}) {
  const message = error?.message ?? "Unknown error";
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, background: "#070A15", color: "#E8ECF6", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 420, textAlign: "center", padding: 32, borderRadius: 32, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>خطأ في التطبيق</h1>
            <p style={{ fontFamily: "monospace", fontSize: 13, color: "#F472B6", marginBottom: 24, wordBreak: "break-word" }}>{message}</p>
            <button
              onClick={() => reset()}
              style={{ borderRadius: 999, border: "none", padding: "10px 24px", fontWeight: 600, color: "#0B1020", background: "linear-gradient(to top right,#38E1D6,#8B7CF6)", cursor: "pointer" }}
            >
              أعد المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
