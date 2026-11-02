"use client";

import { Bell, Edit3, Trash2 } from "lucide-react";
import { RoutineResponse } from "@server/types";
import { getRoutineStatus, CATEGORY_COLORS } from "@/lib/constants/routine";
import RoutineTimeHeader from "./RoutineTimeHeader";

interface RoutineTimelineItemProps {
  routine: RoutineResponse;
  showDayBadge?: boolean;
  onEdit: (routine: RoutineResponse) => void;
  onDelete: (id: string) => void;
}

export default function RoutineTimelineItem({
  routine,
  showDayBadge = false,
  onEdit,
  onDelete,
}: RoutineTimelineItemProps) {
  const status = getRoutineStatus(routine.dayOfWeek, routine.startTime, routine.endTime);
  const catStyle = CATEGORY_COLORS[routine.category] || CATEGORY_COLORS.General;
  const accentColor = routine.color || catStyle.text;

  return (
    <div
      className="glass-card"
      style={{
        position: "relative",
        padding: "1rem 1.25rem",
        borderRadius: "0.875rem",
        borderLeft: `4px solid ${accentColor}`,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <RoutineTimeHeader
            startTime={routine.startTime}
            endTime={routine.endTime}
            status={status}
            dayOfWeek={routine.dayOfWeek}
            accentColor={accentColor}
            showDayBadge={showDayBadge}
          />

          <h4
            style={{
              margin: "0 0 0.25rem",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "var(--foreground)",
              wordBreak: "break-word",
            }}
          >
            {routine.title}
          </h4>

          {routine.description && (
            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.8125rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.45,
                wordBreak: "break-word",
              }}
            >
              {routine.description}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                padding: "0.15rem 0.5rem",
                borderRadius: "0.375rem",
                backgroundColor: catStyle.bg,
                color: catStyle.text,
                border: `1px solid ${catStyle.border}`,
              }}
            >
              {routine.category}
            </span>

            {routine.reminder && (
              <span
                title="Reminder indicator"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.6875rem",
                  color: "var(--muted-foreground)",
                }}
              >
                <Bell size={12} />
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
          <button
            onClick={() => onEdit(routine)}
            style={{
              background: "transparent",
              border: "none",
              padding: "0.35rem",
              borderRadius: "0.375rem",
              color: "var(--muted-foreground)",
              cursor: "pointer",
            }}
            title="Edit Routine"
            aria-label="Edit Routine"
          >
            <Edit3 size={15} />
          </button>

          <button
            onClick={() => onDelete(routine.id)}
            style={{
              background: "transparent",
              border: "none",
              padding: "0.35rem",
              borderRadius: "0.375rem",
              color: "var(--color-error)",
              cursor: "pointer",
            }}
            title="Delete Routine"
            aria-label="Delete Routine"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
