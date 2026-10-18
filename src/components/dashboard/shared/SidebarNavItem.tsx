"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export default function SidebarNavItem({
  label,
  href,
  icon: Icon,
  isActive,
  badge,
  onClick,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.65rem 0.875rem",
        borderRadius: "0.625rem",
        fontSize: "0.875rem",
        fontWeight: isActive ? 600 : 500,
        textDecoration: "none",
        transition: "all 0.15s ease",
        color: isActive ? "var(--color-brand-500)" : "var(--muted-foreground)",
        backgroundColor: isActive ? "rgba(99, 102, 241, 0.1)" : "transparent",
        border: isActive ? "1px solid rgba(99, 102, 241, 0.2)" : "1px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "var(--muted)";
          e.currentTarget.style.color = "var(--foreground)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "var(--muted-foreground)";
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
        <span>{label}</span>
      </div>

      {badge !== undefined && (
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            padding: "0.15rem 0.45rem",
            borderRadius: "1rem",
            background: isActive ? "var(--color-brand-500)" : "var(--muted)",
            color: isActive ? "#ffffff" : "var(--foreground)",
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
