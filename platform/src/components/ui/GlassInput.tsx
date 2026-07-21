import { type InputHTMLAttributes, forwardRef } from "react";

export const GlassInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  function GlassInput({ label, className = "", id, ...props }, ref) {
    return (
      <label className="block space-y-1.5">
        {label && <span className="text-sm text-white/70">{label}</span>}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-2xl bg-white/5 border border-white/12 px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua ${className}`}
          {...props}
        />
      </label>
    );
  },
);
