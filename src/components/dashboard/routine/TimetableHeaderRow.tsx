"use client";

import { DayOption } from "@/lib/constants/routine";
import { DayOfWeek } from "@server/types";

interface TimetableHeaderRowProps {
  days: DayOption[];
  currentDay: DayOfWeek;
}

export default function TimetableHeaderRow({ days, currentDay }: TimetableHeaderRowProps) {
  return (
    <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
      <th style={{ width: "85px", padding: "0.75rem 0.5rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-foreground)", textAlign: "center" }}>
        Time
      </th>
      {days.map((day) => {
        const isToday = day.key === currentDay;
        return (
          <th
            key={day.key}
            style={{
              padding: "0.75rem 0.5rem",
              textAlign: "center",
              borderLeft: "1px solid var(--border)",
              backgroundColor: isToday ? "rgba(99, 102, 241, 0.08)" : "transparent",
            }}
          >
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: isToday ? "var(--color-brand-500)" : "var(--foreground)" }}>
              {day.fullLabel}
            </span>
            {isToday && (
              <span style={{ display: "block", fontSize: "0.625rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase" }}>
                Today
              </span>
            )}
          </th>
        );
      })}
    </tr>
  );
}
