"use client";

import { Plus, Clock, LayoutGrid } from "lucide-react";

interface RoutineHeaderProps {
  viewMode: "timeline" | "weekly";
  onToggleViewMode: (mode: "timeline" | "weekly") => void;
  onOpenCreate: () => void;
}

export default function RoutineHeader({
  viewMode,
  onToggleViewMode,
  onOpenCreate,
}: RoutineHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "1.25rem",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
          }}
        >
          Routine Planner
        </h1>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
          Structure your recurring day and master your weekly productivity habits.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            display: "flex",
            backgroundColor: "var(--muted)",
            padding: "0.2rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
          }}
        >
          <button
            onClick={() => onToggleViewMode("timeline")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "0.375rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              border: "none",
              backgroundColor: viewMode === "timeline" ? "var(--card)" : "transparent",
              color: viewMode === "timeline" ? "var(--foreground)" : "var(--muted-foreground)",
              boxShadow: viewMode === "timeline" ? "var(--shadow-sm)" : "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Clock size={13} />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => onToggleViewMode("weekly")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "0.375rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              border: "none",
              backgroundColor: viewMode === "weekly" ? "var(--card)" : "transparent",
              color: viewMode === "weekly" ? "var(--foreground)" : "var(--muted-foreground)",
              boxShadow: viewMode === "weekly" ? "var(--shadow-sm)" : "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <LayoutGrid size={13} />
            <span>Weekly Matrix</span>
          </button>
        </div>

        <button
          onClick={onOpenCreate}
          className="hero-btn-primary"
          style={{ padding: "0.5rem 1rem", fontSize: "0.8125rem" }}
        >
          <Plus size={15} /> Add Routine
        </button>
      </div>
    </div>
  );
}

