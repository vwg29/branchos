"use client";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "aura";

const styles: Record<Variant, string> = {
  primary: "bg-surface-hover border border-border text-text-primary hover:bg-surface hover:border-border-strong hover:shadow-glass-elevated",
  secondary: "bg-surface border border-border text-text-primary hover:bg-surface-hover hover:border-border-strong",
  ghost: "bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary",
  danger: "bg-rose/20 border border-rose/30 text-rose hover:bg-rose/30 hover:border-rose/40 hover:shadow-[0_0_24px_rgba(244,114,182,0.2)]",
  aura: "bg-aura text-night-text font-semibold hover:shadow-aura hover:bg-aura/90",
};

export const GlassButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg" }>(
  function GlassButton({ variant = "primary", size = "md", className = "", disabled, children, ...props }, ref) {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-7 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`rounded-pill font-medium transition-all duration-fast ease-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-aura/50 disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);
