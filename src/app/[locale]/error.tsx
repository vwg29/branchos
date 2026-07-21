"use client";

export default function LocaleError({
  error,
  reset,
}: {
  error?: (Error & { digest?: string }) | null;
  reset: () => void;
}) {
  const message = error?.message ?? "خطأ غير معروف";
  return (
    <div className="bg-blobs flex min-h-screen items-center justify-center p-6">
      <div className="glass-surface max-w-md rounded-squircle p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">حدث خطأ</h1>
        <p className="mb-6 break-words font-mono text-sm text-rose">{message}</p>
        <button
          onClick={() => reset()}
          className="rounded-pill bg-gradient-to-tr from-aqua/80 to-violet/80 px-6 py-2.5 font-semibold text-night"
        >
          أعد المحاولة
        </button>
      </div>
    </div>
  );
}
