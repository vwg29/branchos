"use client";
import { type InputHTMLAttributes, forwardRef, useState } from "react";

export const GlassInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string; showToggle?: boolean }>(
  function GlassInput({ label, className = "", id, type = "text", showToggle = false, ...props }, ref) {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showToggle && type === "password" ? (showPassword ? "text" : "password") : type;
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <label className="block space-y-1.5">
        {label && <span className="text-label text-text-secondary">{label}</span>}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`w-full rounded-2xl bg-surface border border-border px-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-aura/50 transition-all duration-fast ${showToggle ? "pr-12" : ""} ${className}`}
            {...props}
          />
          {showToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 inset-inline-end-0 flex items-center pr-3 text-text-muted hover:text-text-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          )}
        </div>
      </label>
    );
  },
);
