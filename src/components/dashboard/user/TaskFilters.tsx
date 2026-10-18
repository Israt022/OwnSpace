"use client";

import { Search, X, Flag } from "lucide-react";

interface TaskFiltersProps {
  statusFilter: "all" | "pending" | "completed";
  onStatusChange: (status: "all" | "pending" | "completed") => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
}

export default function TaskFilters({
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  searchQuery,
  onSearchChange,
  categories,
}: TaskFiltersProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.25rem" }}>
      {/* Status tabs + Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "inline-flex", padding: "0.2rem", borderRadius: "0.5rem", background: "var(--muted)", border: "1px solid var(--border)" }}>
          {(["all", "pending", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              style={{
                padding: "0.4rem 0.85rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                background: statusFilter === status ? "var(--card)" : "transparent",
                color: statusFilter === status ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              {status === "all" ? "All Tasks" : status === "pending" ? "In Progress" : "Completed"}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "240px" }}>
          <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
            style={{ paddingLeft: "2.25rem", paddingRight: searchQuery ? "2rem" : "0.75rem", height: "2.25rem", fontSize: "0.8125rem" }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Category pills + Priority dropdown */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`category-pill ${categoryFilter === cat ? "active" : ""}`}
              style={{ cursor: "pointer" }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Flag size={13} style={{ color: "var(--muted-foreground)" }} />
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="input-field"
            style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", height: "2rem", width: "auto" }}
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>
    </div>
  );
}
