"use client";

import { useState } from "react";
import Image from "next/image";
import { Shield, Users } from "lucide-react";
import { AdminUserItem } from "@server/services/admin.service";
import ConfirmDialog from "../shared/ConfirmDialog";

interface UsersTableProps {
  users: AdminUserItem[];
  currentAdminId: string;
  loading: boolean;
  onRoleToggle: (userId: string, currentRole: string) => Promise<void>;
}

export default function UsersTable({
  users,
  currentAdminId,
  loading,
  onRoleToggle,
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleConfirmRoleChange = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    try {
      await onRoleToggle(selectedUser.id, selectedUser.role);
      setSelectedUser(null);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted-foreground)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <th style={{ padding: "0.75rem 1rem" }}>User</th>
            <th style={{ padding: "0.75rem 1rem" }}>Role</th>
            <th style={{ padding: "0.75rem 1rem" }}>Tasks</th>
            <th style={{ padding: "0.75rem 1rem" }}>Completion</th>
            <th style={{ padding: "0.75rem 1rem" }}>Joined</th>
            <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                <div className="spinner" style={{ margin: "0 auto 0.75rem" }} />
                Loading user directory…
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => {
              const rate = u.totalTasks > 0 ? Math.round((u.completedTasks / u.totalTasks) * 100) : 0;
              const isCurrentAdmin = u.id === currentAdminId;

              return (
                <tr
                  key={u.id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {u.image ? (
                        <Image src={u.image} alt={u.name} width={34} height={34} style={{ borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "0.8125rem" }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--foreground)" }}>
                          {u.name} {isCurrentAdmin && <span style={{ fontSize: "0.7rem", color: "var(--color-brand-500)" }}>(You)</span>}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "1rem", background: u.role === "ADMIN" ? "rgba(99, 102, 241, 0.15)" : "var(--muted)", color: u.role === "ADMIN" ? "var(--color-brand-500)" : "var(--muted-foreground)", border: `1px solid ${u.role === "ADMIN" ? "rgba(99, 102, 241, 0.3)" : "var(--border)"}` }}>
                      {u.role === "ADMIN" ? <Shield size={12} /> : <Users size={12} />}
                      {u.role}
                    </span>
                  </td>

                  <td style={{ padding: "0.85rem 1rem", color: "var(--foreground)", fontWeight: 500 }}>
                    {u.totalTasks} tasks
                  </td>

                  <td style={{ padding: "0.85rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{rate}%</span>
                      <div style={{ width: "45px", height: "5px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${rate}%`, height: "100%", background: rate > 60 ? "#22c55e" : "#6366f1" }} />
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "0.85rem 1rem", color: "var(--muted-foreground)", fontSize: "0.8125rem" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                    {isCurrentAdmin ? (
                      <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", fontStyle: "italic" }}>Current</span>
                    ) : (
                      <button
                        onClick={() => setSelectedUser(u)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "1px solid var(--border)",
                          background: u.role === "ADMIN" ? "rgba(239, 68, 68, 0.1)" : "var(--muted)",
                          color: u.role === "ADMIN" ? "#ef4444" : "var(--foreground)",
                        }}
                      >
                        {u.role === "ADMIN" ? "Demote" : "Promote"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {selectedUser && (
        <ConfirmDialog
          isOpen={!!selectedUser}
          title={selectedUser.role === "ADMIN" ? "Demote Admin to User" : "Promote User to Admin"}
          message={`Are you sure you want to change ${selectedUser.name}'s role from ${selectedUser.role} to ${selectedUser.role === "ADMIN" ? "USER" : "ADMIN"}?`}
          confirmLabel={selectedUser.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
          isDestructive={selectedUser.role === "ADMIN"}
          isLoading={updating}
          onConfirm={handleConfirmRoleChange}
          onCancel={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
