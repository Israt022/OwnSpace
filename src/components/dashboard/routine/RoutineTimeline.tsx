"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { RoutineResponse, DayOfWeek } from "@server/types";
import { ROUTINE_CATEGORIES, DAYS_OF_WEEK } from "@/lib/constants/routine";
import RoutineTimelineItem from "./RoutineTimelineItem";
import RoutineEmptyState from "./RoutineEmptyState";

interface RoutineTimelineProps {
  routines: RoutineResponse[];
  selectedDay: DayOfWeek | "ALL";
  categoryFilter: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onEdit: (routine: RoutineResponse) => void;
  onDelete: (id: string) => void;
  onOpenCreate: () => void;
}

export default function RoutineTimeline({
  routines,
  selectedDay,
  categoryFilter,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onEdit,
  onDelete,
  onOpenCreate,
}: RoutineTimelineProps) {
  const currentDayLabel =
    selectedDay === "ALL"
      ? "this week"
      : DAYS_OF_WEEK.find((d) => d.key === selectedDay)?.fullLabel || selectedDay;

  return (
    <div>
      {/* Search and Category Filter Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ position: "relative", minWidth: "220px", flex: 1 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted-foreground)",
            }}
          />
          <input
            type="text"
            placeholder="Search routines..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
            style={{ paddingLeft: "2.25rem", height: "38px", fontSize: "0.8125rem" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", overflowX: "auto" }}>
          <button
            onClick={() => onSelectCategory("All")}
            style={{
              padding: "0.35rem 0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              border: categoryFilter === "All" ? "1px solid var(--color-brand-500)" : "1px solid var(--border)",
              backgroundColor: categoryFilter === "All" ? "rgba(99, 102, 241, 0.12)" : "var(--card)",
              color: categoryFilter === "All" ? "var(--color-brand-500)" : "var(--muted-foreground)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            All
          </button>
          {ROUTINE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                border: categoryFilter === cat ? "1px solid var(--color-brand-500)" : "1px solid var(--border)",
                backgroundColor: categoryFilter === cat ? "rgba(99, 102, 241, 0.12)" : "var(--card)",
                color: categoryFilter === cat ? "var(--color-brand-500)" : "var(--muted-foreground)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Routine List */}
      {routines.length === 0 ? (
        <RoutineEmptyState dayLabel={currentDayLabel} onOpenCreate={onOpenCreate} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {routines.map((routine, idx) => (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
            >
              <RoutineTimelineItem
                routine={routine}
                showDayBadge={selectedDay === "ALL"}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

