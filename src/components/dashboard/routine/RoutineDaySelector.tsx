"use client";

import { DayOfWeek } from "@server/types";
import { DAYS_OF_WEEK, getCurrentDayOfWeek } from "@/lib/constants/routine";

interface RoutineDaySelectorProps {
  selectedDay: DayOfWeek | "ALL";
  onSelectDay: (day: DayOfWeek | "ALL") => void;
  dayCounts: Record<DayOfWeek, number>;
  totalCount: number;
}

export default function RoutineDaySelector({
  selectedDay,
  onSelectDay,
  dayCounts,
  totalCount,
}: RoutineDaySelectorProps) {
  const today = getCurrentDayOfWeek();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        overflowX: "auto",
        paddingBottom: "0.25rem",
        scrollbarWidth: "none",
      }}
    >
      <button
        onClick={() => onSelectDay("ALL")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.5rem 0.875rem",
          borderRadius: "0.625rem",
          fontSize: "0.8125rem",
          fontWeight: 600,
          border: selectedDay === "ALL" ? "1px solid var(--color-brand-500)" : "1px solid var(--border)",
          backgroundColor: selectedDay === "ALL" ? "rgba(99, 102, 241, 0.12)" : "var(--card)",
          color: selectedDay === "ALL" ? "var(--color-brand-500)" : "var(--foreground)",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.15s ease",
        }}
      >
        <span>All Week</span>
        <span
          style={{
            fontSize: "0.6875rem",
            padding: "0.1rem 0.4rem",
            borderRadius: "1rem",
            background: selectedDay === "ALL" ? "var(--color-brand-500)" : "var(--muted)",
            color: selectedDay === "ALL" ? "#ffffff" : "var(--muted-foreground)",
          }}
        >
          {totalCount}
        </span>
      </button>

      {DAYS_OF_WEEK.map((day) => {
        const isSelected = selectedDay === day.key;
        const isToday = day.key === today;
        const count = dayCounts[day.key] || 0;

        return (
          <button
            key={day.key}
            onClick={() => onSelectDay(day.key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 0.875rem",
              borderRadius: "0.625rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              border: isSelected ? "1px solid var(--color-brand-500)" : "1px solid var(--border)",
              backgroundColor: isSelected ? "rgba(99, 102, 241, 0.12)" : "var(--card)",
              color: isSelected ? "var(--color-brand-500)" : "var(--foreground)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              position: "relative",
              transition: "all 0.15s ease",
            }}
          >
            <span>{day.shortLabel}</span>
            {isToday && (
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                }}
                title="Today"
              />
            )}
            <span
              style={{
                fontSize: "0.6875rem",
                padding: "0.1rem 0.4rem",
                borderRadius: "1rem",
                background: isSelected ? "var(--color-brand-500)" : "var(--muted)",
                color: isSelected ? "#ffffff" : "var(--muted-foreground)",
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

