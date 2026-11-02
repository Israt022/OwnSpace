"use client";

import { useMemo } from "react";
import { Plus, Calendar } from "lucide-react";
import { RoutineEntryResponse, DayOfWeek } from "@server/types";
import {
  DayOption,
  DAYS_MONDAY_START,
  DAYS_SATURDAY_START,
} from "@/lib/constants/routine";
import TimetableActivityCard from "./TimetableActivityCard";
import TimetableDayFilterBar from "./TimetableDayFilterBar";

interface TimetableDayViewProps {
  entries: RoutineEntryResponse[];
  selectedDay: DayOfWeek | "ALL";
  onSelectDay: (day: DayOfWeek | "ALL") => void;
  dayStartOption: "MONDAY" | "SATURDAY";
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onSelectCategory: (cat: string) => void;
  onEditEntry: (entry: RoutineEntryResponse) => void;
  onDeleteEntry: (id: string) => void;
  onOpenAddEntryWithDay: (day: DayOfWeek) => void;
}

export default function TimetableDayView({
  entries,
  selectedDay,
  onSelectDay,
  dayStartOption,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onSelectCategory,
  onEditEntry,
  onDeleteEntry,
  onOpenAddEntryWithDay,
}: TimetableDayViewProps) {
  const days: DayOption[] = dayStartOption === "SATURDAY" ? DAYS_SATURDAY_START : DAYS_MONDAY_START;

  const dayCounts = useMemo(() => {
    const map: Record<string, number> = {};
    entries.forEach((e) => {
      map[e.dayOfWeek] = (map[e.dayOfWeek] || 0) + 1;
    });
    return map;
  }, [entries]);

  const targetDay = selectedDay === "ALL" ? "MONDAY" : selectedDay;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <TimetableDayFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        categoryFilter={categoryFilter}
        onSelectCategory={onSelectCategory}
      />

      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
        <button
          onClick={() => onSelectDay("ALL")}
          style={{
            padding: "0.45rem 0.8rem",
            borderRadius: "0.5rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            border: selectedDay === "ALL" ? "1px solid var(--color-brand-500)" : "1px solid var(--border)",
            backgroundColor: selectedDay === "ALL" ? "rgba(99, 102, 241, 0.12)" : "var(--card)",
            color: selectedDay === "ALL" ? "var(--color-brand-500)" : "var(--foreground)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          All Week ({entries.length})
        </button>
        {days.map((d) => {
          const isSelected = selectedDay === d.key;
          const count = dayCounts[d.key] || 0;
          return (
            <button
              key={d.key}
              onClick={() => onSelectDay(d.key)}
              style={{
                padding: "0.45rem 0.8rem",
                borderRadius: "0.5rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                border: isSelected ? "1px solid var(--color-brand-500)" : "1px solid var(--border)",
                backgroundColor: isSelected ? "rgba(99, 102, 241, 0.12)" : "var(--card)",
                color: isSelected ? "var(--color-brand-500)" : "var(--foreground)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {d.shortLabel} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {entries.map((entry) => (
          <TimetableActivityCard
            key={entry.id}
            entry={entry}
            onEdit={onEditEntry}
            onDelete={onDeleteEntry}
          />
        ))}

        {entries.length === 0 && (
          <div
            className="glass-card"
            style={{
              padding: "2.5rem 1rem",
              borderRadius: "0.875rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={28} style={{ color: "var(--muted-foreground)", marginBottom: "0.5rem", opacity: 0.5 }} />
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
              No activities scheduled for this day
            </p>
            <button
              onClick={() => onOpenAddEntryWithDay(targetDay)}
              className="hero-btn-primary"
              style={{ padding: "0.45rem 0.95rem", fontSize: "0.8125rem", gap: "0.3rem" }}
            >
              <Plus size={14} /> Add Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
