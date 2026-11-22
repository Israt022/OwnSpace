"use client";

import Link from "next/link";
import { Shield, ArrowLeftRight } from "lucide-react";

interface SidebarRoleSwitcherProps {
  role: "USER" | "ADMIN";
  isCollapsed?: boolean;
  onNavClick?: () => void;
}

export default function SidebarRoleSwitcher({
  role,
  isCollapsed = false,
  onNavClick,
}: SidebarRoleSwitcherProps) {
  const targetHref = role === "ADMIN" ? "/dashboard?view=user" : "/admin";
  const actionText = role === "ADMIN" ? "Open My Tasks" : "Open Admin";

  if (isCollapsed) {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          marginTop: "auto",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <Link
          href={targetHref}
          onClick={onNavClick}
          className="nav-item-link"
          title={`Role Switcher: ${actionText}`}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38px",
            height: "38px",
            borderRadius: "0.5rem",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
        >
          <ArrowLeftRight size={16} />
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
            {actionText}
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "auto",
        padding: "0.875rem",
        borderRadius: "0.75rem",
        background: "var(--muted)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <Shield size={16} style={{ color: "var(--color-brand-500)" }} />
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground)" }}>
          Role Switcher
        </span>
      </div>
      <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
        {role === "ADMIN"
          ? "Switch to manage your own personal tasks."
          : "Switch back to platform administration."}
      </p>
      <Link
        href={targetHref}
        onClick={onNavClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          padding: "0.45rem",
          borderRadius: "0.5rem",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--primary-foreground)",
          background: "var(--primary)",
          textDecoration: "none",
        }}
      >
        <ArrowLeftRight size={13} />
        {actionText}
      </Link>
    </div>
  );
}
