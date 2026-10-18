"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import UserFilters from "@/components/dashboard/admin/UserFilters";
import UsersTable from "@/components/dashboard/admin/UsersTable";
import { AdminUserItem } from "@server/services/admin.service";
import { SessionUser } from "@/lib/session";

interface AdminUsersClientProps {
  currentAdmin: SessionUser;
}

export default function AdminUsersClient({ currentAdmin }: AdminUsersClientProps) {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchUsers = async () => {
    try {
      const roleParam = roleFilter === "ALL" ? "" : roleFilter;
      const res = await fetch(`/api/admin/users?role=${roleParam}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setUsers(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      fetchUsers();
    } else {
      alert("Failed to update user role");
    }
  };

  return (
    <DashboardShell
      user={currentAdmin}
      role="ADMIN"
      title="User Directory"
      subtitle="Inspect accounts, view task progress, and manage role authorizations."
    >
      <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
              Registered Accounts ({users.length})
            </h3>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
              Filter by name, email, or role.
            </p>
          </div>

          <UserFilters
            search={search}
            onSearchChange={setSearch}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
          />
        </div>

        <UsersTable
          users={users}
          currentAdminId={currentAdmin.id}
          loading={loading}
          onRoleToggle={handleRoleToggle}
        />
      </div>
    </DashboardShell>
  );
}
