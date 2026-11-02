"use client";

import { Plus, Edit2, Trash2, LayoutGrid, CalendarDays } from "lucide-react";
import { RoutineResponse } from "@server/types";
import RoutineListSwitcher from "./RoutineListSwitcher";

interface RoutineTopBarProps {
  routines: RoutineResponse[];
  activeRoutine?: RoutineResponse;
  onSelectRoutine: (id: string) => void;
  onOpenCreateRoutine: () => void;
  onOpenEditRoutine: (routine: RoutineResponse) => void;
  onDeleteRoutine: (id: string) => void;
  onOpenAddEntry: () => void;
  dayStartOption: "MONDAY" | "SATURDAY";
  onToggleDayStart: (opt: "MONDAY" | "SATURDAY") => void;
  viewMode: "timetable" | "day";
  onToggleViewMode: (mode: "timetable" | "day") => void;
}

export default function RoutineTopBar({
  routines,
  activeRoutine,
  onSelectRoutine,
  onOpenCreateRoutine,
  onOpenEditRoutine,
  onDeleteRoutine,
  onOpenAddEntry,
  dayStartOption,
  onToggleDayStart,
  viewMode,
  onToggleViewMode,
}: RoutineTopBarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Routine Timetable
          </h1>
          <p style={{ margin: "0.2rem 0 0", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            Recurring weekly timetable for university classes, study blocks, and weekly schedules.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={onOpenCreateRoutine}
            className="hero-btn-secondary"
            style={{ padding: "0.5rem 0.85rem", fontSize: "0.8125rem", gap: "0.35rem" }}
          >
            <Plus size={14} /> New Routine
          </button>

          {activeRoutine && (
            <button
              onClick={onOpenAddEntry}
              className="hero-btn-primary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.8125rem", gap: "0.35rem" }}
            >
              <Plus size={15} /> Add Activity
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          padding: "0.5rem 0.75rem",
          borderRadius: "0.75rem",
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <RoutineListSwitcher
          routines={routines}
          activeRoutine={activeRoutine}
          onSelectRoutine={onSelectRoutine}
        />

        {activeRoutine && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              onClick={() => onOpenEditRoutine(activeRoutine)}
              title="Edit Routine Name"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "0.25rem" }}
            >
              <Edit2 size={14} />
            </button>

            <button
              onClick={() => onDeleteRoutine(activeRoutine.id)}
              title="Delete Routine"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: "0.25rem" }}
            >
              <Trash2 size={14} />
            </button>

            <span style={{ height: "16px", width: "1px", backgroundColor: "var(--border)" }} />

            <button
              onClick={() => onToggleDayStart(dayStartOption === "MONDAY" ? "SATURDAY" : "MONDAY")}
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.375rem",
                background: "var(--muted)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                cursor: "pointer",
              }}
              title="Change weekday order"
            >
              {dayStartOption === "MONDAY" ? "Mon–Sun" : "Sat–Fri"}
            </button>

            <div style={{ display: "flex", background: "var(--muted)", borderRadius: "0.375rem", padding: "0.15rem" }}>
              <button
                onClick={() => onToggleViewMode("timetable")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.25rem 0.45rem",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  background: viewMode === "timetable" ? "var(--card)" : "transparent",
                  color: viewMode === "timetable" ? "var(--foreground)" : "var(--muted-foreground)",
                }}
                title="Timetable View"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => onToggleViewMode("day")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.25rem 0.45rem",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  background: viewMode === "day" ? "var(--card)" : "transparent",
                  color: viewMode === "day" ? "var(--foreground)" : "var(--muted-foreground)",
                }}
                title="Day Schedule View"
              >
                <CalendarDays size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
