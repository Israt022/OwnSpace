"use client";

import { Clock } from "lucide-react";
import { RoutineResponse } from "@server/types";
import {
  formatTime12Hour,
  calculateDuration,
  CATEGORY_COLORS,
} from "@/lib/constants/routine";

interface RoutineWeeklyCardItemProps {
  routine: RoutineResponse;
  onEdit: (routine: RoutineResponse) => void;
}

export default function RoutineWeeklyCardItem({
  routine,
  onEdit,
}: RoutineWeeklyCardItemProps) {
  const catStyle = CATEGORY_COLORS[routine.category] || CATEGORY_COLORS.General;
  const accentColor = routine.color || catStyle.text;

  return (
    <div
      onClick={() => onEdit(routine)}
      style={{
        padding: "0.6rem 0.75rem",
        borderRadius: "0.5rem",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${accentColor}`,
        cursor: "pointer",
        transition: "transform 0.15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          fontSize: "0.6875rem",
          color: "var(--muted-foreground)",
          marginBottom: "0.2rem",
        }}
      >
        <Clock size={11} />
        <span>{formatTime12Hour(routine.startTime)}</span>
        <span>•</span>
        <span>{calculateDuration(routine.startTime, routine.endTime)}</span>
      </div>

      <div
        style={{
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--foreground)",
          marginBottom: "0.25rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {routine.title}
      </div>

      <span
        style={{
          fontSize: "0.625rem",
          fontWeight: 600,
          padding: "0.1rem 0.35rem",
          borderRadius: "0.25rem",
          backgroundColor: catStyle.bg,
          color: catStyle.text,
        }}
      >
        {routine.category}
      </span>
    </div>
  );
}

