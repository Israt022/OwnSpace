"use client";

import { Search } from "lucide-react";
import { TIMETABLE_CATEGORIES } from "@/lib/constants/routine";

interface TimetableDayFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onSelectCategory: (cat: string) => void;
}

export default function TimetableDayFilterBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onSelectCategory,
}: TimetableDayFilterBarProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ position: "relative", minWidth: "200px", flex: 1 }}>
        <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
        <input
          type="text"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field"
          style={{ paddingLeft: "2.25rem", height: "36px", fontSize: "0.8125rem" }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto" }}>
        <button
          onClick={() => onSelectCategory("All")}
          style={{
            padding: "0.3rem 0.65rem",
            borderRadius: "0.375rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            border: categoryFilter === "All" ? "1px solid var(--color-brand-500)" : "1px solid var(--border)",
            backgroundColor: categoryFilter === "All" ? "rgba(99, 102, 241, 0.12)" : "var(--card)",
            color: categoryFilter === "All" ? "var(--color-brand-500)" : "var(--muted-foreground)",
            cursor: "pointer",
          }}
        >
          All
        </button>
        {TIMETABLE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "0.375rem",
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
  );
}

