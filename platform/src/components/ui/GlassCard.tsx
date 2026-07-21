import { type ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag className={`glass-surface rounded-squircle p-6 ${className}`}>
      {children}
    </Tag>
  );
}
