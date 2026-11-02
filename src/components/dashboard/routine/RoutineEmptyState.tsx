"use client";

import { CalendarClock, Plus } from "lucide-react";

interface RoutineEmptyStateProps {
  dayLabel?: string;
  onOpenCreate: () => void;
}

export default function RoutineEmptyState({ dayLabel, onOpenCreate }: RoutineEmptyStateProps) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "3.5rem 1.5rem",
        borderRadius: "1rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.1)",
          color: "var(--color-brand-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <CalendarClock size={28} />
      </div>

      <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
        No routines scheduled {dayLabel ? `for ${dayLabel}` : "yet"}
      </h3>

      <p
        style={{
          margin: "0 0 1.25rem",
          fontSize: "0.875rem",
          color: "var(--muted-foreground)",
          maxWidth: "380px",
          lineHeight: 1.5,
        }}
      >
        Structure your day with recurring blocks for deep work, exercise, study, and personal habits.
      </p>

      <button
        onClick={onOpenCreate}
        className="hero-btn-primary"
        style={{ padding: "0.55rem 1.25rem", fontSize: "0.875rem" }}
      >
        <Plus size={16} /> Add Your First Routine
      </button>
    </div>
  );
}

