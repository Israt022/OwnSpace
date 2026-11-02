"use client";

import { Clock, Zap } from "lucide-react";
import { formatTime12Hour, calculateDuration, DAYS_OF_WEEK } from "@/lib/constants/routine";
import { DayOfWeek } from "@server/types";

interface RoutineTimeHeaderProps {
  startTime: string;
  endTime: string;
  status: "active" | "upcoming" | "passed";
  dayOfWeek: DayOfWeek;
  accentColor: string;
  showDayBadge?: boolean;
}

export default function RoutineTimeHeader({
  startTime,
  endTime,
  status,
  dayOfWeek,
  accentColor,
  showDayBadge = false,
}: RoutineTimeHeaderProps) {
  const duration = calculateDuration(startTime, endTime);
  const dayLabel = DAYS_OF_WEEK.find((d) => d.key === dayOfWeek)?.shortLabel || dayOfWeek;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          fontSize: "0.8125rem",
          fontWeight: 700,
          color: "var(--foreground)",
        }}
      >
        <Clock size={13} style={{ color: accentColor }} />
        {formatTime12Hour(startTime)} – {formatTime12Hour(endTime)}
      </span>

      <span
        style={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          padding: "0.1rem 0.45rem",
          borderRadius: "0.375rem",
          background: "var(--muted)",
          color: "var(--muted-foreground)",
        }}
      >
        {duration}
      </span>

      {status === "active" && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.6875rem",
            fontWeight: 700,
            padding: "0.1rem 0.5rem",
            borderRadius: "1rem",
            background: "rgba(245, 158, 11, 0.15)",
            color: "#f59e0b",
          }}
        >
          <Zap size={11} /> Active Now
        </span>
      )}

      {showDayBadge && (
        <span
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            padding: "0.1rem 0.45rem",
            borderRadius: "0.375rem",
            background: "rgba(99, 102, 241, 0.1)",
            color: "var(--color-brand-500)",
          }}
        >
          {dayLabel}
        </span>
      )}
    </div>
  );
}

