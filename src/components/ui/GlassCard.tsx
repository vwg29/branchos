import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  elevated?: boolean;
  panel?: boolean;
}

export function GlassCard({
  children,
  className = "",
  as: Tag = "div",
  elevated = false,
  panel = false,
}: GlassCardProps) {
  const baseClass = "rounded-2xl";
  const styleClass = panel
    ? "bg-surface border border-border p-6 shadow-glass-panel"
    : elevated
    ? "bg-surface/80 border border-border backdrop-blur-xl p-6 shadow-glass-elevated"
    : "bg-surface/60 border border-border backdrop-blur-xl p-6 shadow-glass";

  return (
    <Tag className={`${baseClass} ${styleClass} ${className}`}>
      {children}
    </Tag>
  );
}
