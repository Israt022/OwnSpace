"use client";

import { Menu, PanelLeft } from "lucide-react";
import UserAvatarMenu from "./UserAvatarMenu";
import { SessionUser } from "@/lib/session";

interface DashboardHeaderProps {
  user: SessionUser;
  title: string;
  subtitle?: string;
  onMobileMenuToggle: () => void;
  isSidebarCollapsed?: boolean;
  onDesktopSidebarToggle?: () => void;
  actions?: React.ReactNode;
}

export default function DashboardHeader({
  user,
  title,
  subtitle,
  onMobileMenuToggle,
  isSidebarCollapsed = false,
  onDesktopSidebarToggle,
  actions,
}: DashboardHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="mobile-only"
          type="button"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            background: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            cursor: "pointer",
            color: "var(--foreground)",
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        {/* Desktop sidebar toggle button */}
        {onDesktopSidebarToggle && (
          <button
            onClick={onDesktopSidebarToggle}
            className="desktop-only"
            type="button"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              background: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              cursor: "pointer",
              color: isSidebarCollapsed ? "var(--color-brand-500)" : "var(--muted-foreground)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--foreground)";
              e.currentTarget.style.borderColor = "var(--color-brand-500)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isSidebarCollapsed
                ? "var(--color-brand-500)"
                : "var(--muted-foreground)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
            title={isSidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft size={18} />
          </button>
        )}

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                margin: "0.15rem 0 0",
                fontSize: "0.8125rem",
                color: "var(--muted-foreground)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {actions}
        <UserAvatarMenu user={user} />
      </div>
    </header>
  );
}
