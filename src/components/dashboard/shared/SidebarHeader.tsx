"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import OwnSpaceLogo from "@/components/shared/OwnSpaceLogo";

interface SidebarHeaderProps {
  role: "USER" | "ADMIN";
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function SidebarHeader({
  role,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarHeaderProps) {
  if (isCollapsed) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          paddingBottom: "0.85rem",
          borderBottom: "1px solid var(--border)",
          marginBottom: "0.85rem",
        }}
      >
        <OwnSpaceLogo size={28} showText={false} />
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Expand sidebar (Ctrl+B)"
            aria-label="Expand sidebar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "0.375rem",
              border: "1px solid var(--border)",
              background: "var(--muted)",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--foreground)";
              e.currentTarget.style.borderColor = "var(--color-brand-500)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted-foreground)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <ChevronRight size={15} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "0 0.25rem 1rem",
        borderBottom: "1px solid var(--border)",
        marginBottom: "0.85rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.85rem",
        }}
      >
        <OwnSpaceLogo size={28} showText={true} />
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Collapse sidebar (Ctrl+B)"
            aria-label="Collapse sidebar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "0.375rem",
              border: "1px solid var(--border)",
              background: "var(--muted)",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--foreground)";
              e.currentTarget.style.borderColor = "var(--color-brand-500)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted-foreground)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--foreground)" }}>
          {role === "ADMIN" ? "Admin Workspace" : "Personal Workspace"}
        </span>
        <span
          style={{
            fontSize: "0.6875rem",
            fontWeight: 700,
            padding: "0.15rem 0.5rem",
            borderRadius: "1rem",
            background: role === "ADMIN" ? "rgba(99, 102, 241, 0.15)" : "var(--muted)",
            color: role === "ADMIN" ? "var(--color-brand-500)" : "var(--muted-foreground)",
            textTransform: "uppercase",
          }}
        >
          {role}
        </span>
      </div>
    </div>
  );
}
