"use client";

import { Clock, MapPin, Edit3, Trash2 } from "lucide-react";
import { RoutineEntryResponse } from "@server/types";
import {
  formatTime12Hour,
  calculateDuration,
  CATEGORY_STYLES,
} from "@/lib/constants/routine";

interface TimetableActivityCardProps {
  entry: RoutineEntryResponse;
  onEdit: (entry: RoutineEntryResponse) => void;
  onDelete: (id: string) => void;
}

export default function TimetableActivityCard({
  entry,
  onEdit,
  onDelete,
}: TimetableActivityCardProps) {
  const catStyle = CATEGORY_STYLES[entry.category] || CATEGORY_STYLES.General;
  const accentColor = entry.color || catStyle.text;

  return (
    <div
      style={{
        padding: "0.55rem 0.65rem",
        borderRadius: "0.5rem",
        backgroundColor: catStyle.bg,
        border: `1px solid ${catStyle.border}`,
        borderLeft: `3px solid ${accentColor}`,
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        position: "relative",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.4rem" }}>
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 700,
            color: "var(--foreground)",
            wordBreak: "break-word",
            lineHeight: 1.3,
          }}
        >
          {entry.title}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", flexShrink: 0 }}>
          <button
            onClick={() => onEdit(entry)}
            style={{ background: "none", border: "none", padding: "0.15rem", cursor: "pointer", color: "var(--muted-foreground)" }}
            title="Edit Activity"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            style={{ background: "none", border: "none", padding: "0.15rem", cursor: "pointer", color: "var(--color-error)" }}
            title="Delete Activity"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.6875rem", color: "var(--muted-foreground)", flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
          <Clock size={10} />
          {formatTime12Hour(entry.startTime)} – {formatTime12Hour(entry.endTime)}
        </span>
        <span>•</span>
        <span>{calculateDuration(entry.startTime, entry.endTime)}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.1rem" }}>
        <span
          style={{
            fontSize: "0.625rem",
            fontWeight: 700,
            padding: "0.1rem 0.35rem",
            borderRadius: "0.25rem",
            backgroundColor: "var(--card)",
            color: catStyle.text,
            border: `1px solid ${catStyle.border}`,
          }}
        >
          {entry.category}
        </span>

        {entry.location && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.2rem",
              fontSize: "0.625rem",
              color: "var(--muted-foreground)",
            }}
          >
            <MapPin size={10} />
            {entry.location}
          </span>
        )}
      </div>
    </div>
  );
}

