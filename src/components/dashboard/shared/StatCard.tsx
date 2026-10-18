"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  progressPercent?: number;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "var(--color-brand-500)",
  subtitle,
  progressPercent,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--muted-foreground)",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "0.5rem",
            background: "var(--muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>

      <div
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "var(--foreground)",
          lineHeight: 1.2,
          marginBottom: "0.35rem",
        }}
      >
        {value}
      </div>

      {progressPercent !== undefined && (
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "var(--muted)",
            borderRadius: "4px",
            overflow: "hidden",
            margin: "0.5rem 0",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, progressPercent))}%`,
              height: "100%",
              background: "linear-gradient(90deg, #6366f1, #22c55e)",
              borderRadius: "4px",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      )}

      {subtitle && (
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--muted-foreground)",
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
