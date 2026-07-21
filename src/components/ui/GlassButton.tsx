"use client";
import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-tr from-aqua/80 to-violet/80 text-night font-semibold hover:shadow-glow",
  ghost:
    "glass-surface text-white hover:bg-white/10",
  danger:
    "bg-rose/80 text-white font-semibold hover:bg-rose",
};

export function GlassButton({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`rounded-pill px-5 py-2.5 transition disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
