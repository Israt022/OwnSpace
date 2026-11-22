"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  badge?: string | number;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export default function SidebarNavItem({
  label,
  href,
  icon: Icon,
  isActive,
  badge,
  isCollapsed = false,
  onClick,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="nav-item-link"
      title={isCollapsed ? label : undefined}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: isCollapsed ? "center" : "space-between",
        gap: isCollapsed ? 0 : "0.75rem",
        padding: isCollapsed ? "0.65rem 0" : "0.65rem 0.875rem",
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
      <div style={{ display: "flex", alignItems: "center", gap: isCollapsed ? 0 : "0.75rem" }}>
        <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
        {!isCollapsed && <span>{label}</span>}
      </div>

      {badge !== undefined && !isCollapsed && (
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

      {badge !== undefined && isCollapsed && (
        <span
          style={{
            position: "absolute",
            top: "6px",
            right: "8px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "var(--color-brand-500)",
          }}
        />
      )}

      {isCollapsed && (
        <span
          className="nav-tooltip"
          style={{
            position: "absolute",
            left: "calc(100% + 12px)",
            top: "50%",
            zIndex: 1000,
            padding: "0.35rem 0.65rem",
            borderRadius: "0.375rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          }}
        >
          {label}
        </span>
      )}
    </Link>
  );
}
