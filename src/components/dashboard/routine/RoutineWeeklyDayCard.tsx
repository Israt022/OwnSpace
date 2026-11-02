"use client";

import { Plus } from "lucide-react";
import { RoutineResponse, DayOfWeek } from "@server/types";
import { DayOption } from "@/lib/constants/routine";
import RoutineWeeklyCardItem from "./RoutineWeeklyCardItem";

interface RoutineWeeklyDayCardProps {
  day: DayOption;
  isToday: boolean;
  dayRoutines: RoutineResponse[];
  onEdit: (routine: RoutineResponse) => void;
  onOpenCreateWithDay: (day: DayOfWeek) => void;
}

export default function RoutineWeeklyDayCard({
  day,
  isToday,
  dayRoutines,
  onEdit,
  onOpenCreateWithDay,
}: RoutineWeeklyDayCardProps) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "1rem",
        borderRadius: "0.875rem",
        borderTop: isToday ? "3px solid var(--color-brand-500)" : "1px solid var(--border)",
        minHeight: "260px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--border)",
          marginBottom: "0.75rem",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: isToday ? "var(--color-brand-500)" : "var(--foreground)",
            }}
          >
            {day.fullLabel}
          </span>
          {isToday && (
            <span
              style={{
                marginLeft: "0.4rem",
                fontSize: "0.625rem",
                fontWeight: 700,
                padding: "0.1rem 0.35rem",
                borderRadius: "0.25rem",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                textTransform: "uppercase",
              }}
            >
              Today
            </span>
          )}
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
          {dayRoutines.length}
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {dayRoutines.map((routine) => (
          <RoutineWeeklyCardItem
            key={routine.id}
            routine={routine}
            onEdit={onEdit}
          />
        ))}

        {dayRoutines.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem 0",
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
            }}
          >
            No routines
          </div>
        )}
      </div>

      <button
        onClick={() => onOpenCreateWithDay(day.key)}
        style={{
          marginTop: "0.75rem",
          width: "100%",
          padding: "0.4rem",
          borderRadius: "0.5rem",
          border: "1px dashed var(--border)",
          background: "transparent",
          color: "var(--muted-foreground)",
          fontSize: "0.75rem",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.3rem",
        }}
      >
        <Plus size={13} /> Add
      </button>
    </div>
  );
}
