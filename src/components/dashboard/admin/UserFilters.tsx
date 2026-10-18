"use client";

import { Search, Filter, X } from "lucide-react";

interface UserFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: string;
  onRoleFilterChange: (val: string) => void;
}

export default function UserFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UserFiltersProps) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ position: "relative", minWidth: "240px" }}>
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
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field"
          style={{ paddingLeft: "2.25rem", paddingRight: search ? "2rem" : "0.75rem", height: "2.35rem", fontSize: "0.8125rem" }}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <Filter size={14} style={{ color: "var(--muted-foreground)" }} />
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="input-field"
          style={{ fontSize: "0.8125rem", padding: "0.2rem 0.65rem", height: "2.35rem", width: "auto" }}
        >
          <option value="ALL">All Roles</option>
          <option value="USER">Users Only</option>
          <option value="ADMIN">Admins Only</option>
        </select>
      </div>
    </div>
  );
}
