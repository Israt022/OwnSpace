"use client";

import { Calendar } from "lucide-react";
import { RoutineResponse } from "@server/types";

interface RoutineListSwitcherProps {
  routines: RoutineResponse[];
  activeRoutine?: RoutineResponse;
  onSelectRoutine: (id: string) => void;
}

export default function RoutineListSwitcher({
  routines,
  activeRoutine,
  onSelectRoutine,
}: RoutineListSwitcherProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", overflowX: "auto" }}>
      <Calendar size={15} style={{ color: "var(--color-brand-500)", marginRight: "0.2rem", flexShrink: 0 }} />
      {routines.map((r) => {
        const isActive = r.id === activeRoutine?.id;
        return (
          <button
            key={r.id}
            onClick={() => onSelectRoutine(r.id)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              border: isActive ? "1px solid var(--color-brand-500)" : "1px solid transparent",
              backgroundColor: isActive ? "rgba(99, 102, 241, 0.12)" : "transparent",
              color: isActive ? "var(--color-brand-500)" : "var(--muted-foreground)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {r.name}
          </button>
        );
      })}
    </div>
  );
}

