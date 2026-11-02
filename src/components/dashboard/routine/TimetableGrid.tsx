"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { RoutineEntryResponse, DayOfWeek } from "@server/types";
import {
  DayOption,
  DAYS_MONDAY_START,
  DAYS_SATURDAY_START,
  formatTime12Hour,
  getCurrentDayOfWeek,
  getHoursRange,
} from "@/lib/constants/routine";
import TimetableActivityCard from "./TimetableActivityCard";
import TimetableHeaderRow from "./TimetableHeaderRow";

interface TimetableGridProps {
  entries: RoutineEntryResponse[];
  dayStartOption: "MONDAY" | "SATURDAY";
  onEditEntry: (entry: RoutineEntryResponse) => void;
  onDeleteEntry: (id: string) => void;
  onOpenAddEntryWithSlot: (day: DayOfWeek, startTime: string) => void;
}

export default function TimetableGrid({
  entries,
  dayStartOption,
  onEditEntry,
  onDeleteEntry,
  onOpenAddEntryWithSlot,
}: TimetableGridProps) {
  const currentDay = useMemo(() => getCurrentDayOfWeek(), []);
  const days: DayOption[] = dayStartOption === "SATURDAY" ? DAYS_SATURDAY_START : DAYS_MONDAY_START;

  const hours = useMemo(() => {
    let minH = 8;
    let maxH = 17;
    entries.forEach((e) => {
      const sH = parseInt(e.startTime.split(":")[0], 10);
      const eH = parseInt(e.endTime.split(":")[0], 10);
      if (sH < minH) minH = Math.max(6, sH);
      if (eH > maxH) maxH = Math.min(22, eH + 1);
    });
    return getHoursRange(minH, maxH);
  }, [entries]);

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "0.875rem",
        overflowX: "auto",
        border: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      <table style={{ width: "100%", minWidth: "850px", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <TimetableHeaderRow days={days} currentDay={currentDay} />
        </thead>
        <tbody>
          {hours.map((hour) => {
            const timeStr = `${String(hour).padStart(2, "0")}:00`;
            const displayTime = formatTime12Hour(timeStr);

            return (
              <tr key={hour} style={{ borderBottom: "1px solid var(--border)", minHeight: "68px" }}>
                <td
                  style={{
                    padding: "0.6rem 0.4rem",
                    textAlign: "center",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                    verticalAlign: "top",
                    backgroundColor: "var(--muted)",
                  }}
                >
                  {displayTime}
                </td>
                {days.map((day) => {
                  const dayEntries = entries.filter((e) => {
                    const startH = parseInt(e.startTime.split(":")[0], 10);
                    return e.dayOfWeek === day.key && startH === hour;
                  });

                  return (
                    <td
                      key={day.key}
                      style={{
                        padding: "0.4rem",
                        verticalAlign: "top",
                        borderLeft: "1px solid var(--border)",
                        position: "relative",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        {dayEntries.map((entry) => (
                          <TimetableActivityCard
                            key={entry.id}
                            entry={entry}
                            onEdit={onEditEntry}
                            onDelete={onDeleteEntry}
                          />
                        ))}

                        {dayEntries.length === 0 && (
                          <button
                            onClick={() => onOpenAddEntryWithSlot(day.key, timeStr)}
                            className="timetable-add-slot-btn"
                            style={{
                              width: "100%",
                              height: "36px",
                              border: "1px dashed transparent",
                              background: "transparent",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--muted-foreground)",
                              opacity: 0.35,
                              transition: "all 0.15s ease",
                            }}
                            title={`Add activity on ${day.fullLabel} at ${displayTime}`}
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <style>{`
        .timetable-add-slot-btn:hover {
          border-color: var(--color-brand-500) !important;
          background: rgba(99, 102, 241, 0.08) !important;
          opacity: 1 !important;
          color: var(--color-brand-500) !important;
        }
      `}</style>
    </div>
  );
}
