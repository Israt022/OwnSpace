"use client";

import { Calendar, Plus } from "lucide-react";

interface RoutineTimetableEmptyProps {
  hasRoutines: boolean;
  onAction: () => void;
}

export default function RoutineTimetableEmpty({
  hasRoutines,
  onAction,
}: RoutineTimetableEmptyProps) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "4rem 1.5rem",
        borderRadius: "1rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.12)",
          color: "var(--color-brand-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Calendar size={28} />
      </div>

      <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
        {!hasRoutines ? "No Timetable Created Yet" : "Your Timetable is Empty"}
      </h3>

      <p
        style={{
          margin: "0 0 1.5rem",
          fontSize: "0.875rem",
          color: "var(--muted-foreground)",
          maxWidth: "420px",
          lineHeight: 1.5,
        }}
      >
        {!hasRoutines
          ? "Create a weekly routine like University Class Schedule, Study Timetable, or Workout Plan to structure your week."
          : "Start adding recurring classes, study blocks, lectures, or activities to this weekly timetable."}
      </p>

      <button
        onClick={onAction}
        className="hero-btn-primary"
        style={{ padding: "0.55rem 1.25rem", fontSize: "0.875rem", gap: "0.35rem" }}
      >
        <Plus size={16} /> {!hasRoutines ? "Create First Routine" : "Add Activity to Timetable"}
      </button>
    </div>
  );
}

