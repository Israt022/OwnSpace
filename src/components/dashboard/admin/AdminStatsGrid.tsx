"use client";

import { Users, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import StatCard from "../shared/StatCard";
import { AdminStats } from "@server/services/admin.service";

interface AdminStatsGridProps {
  stats: AdminStats | null;
}

export default function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2rem",
      }}
    >
      <StatCard
        label="Total Users"
        value={stats?.totalUsers ?? 0}
        icon={Users}
        iconColor="var(--color-brand-500)"
        subtitle={`${stats?.totalAdmins ?? 0} Admins • ${stats?.totalRegularUsers ?? 0} Users`}
      />

      <StatCard
        label="System Tasks"
        value={stats?.totalTasks ?? 0}
        icon={Activity}
        iconColor="#6366f1"
        subtitle={`${stats?.recentTasksCount ?? 0} created recently`}
      />

      <StatCard
        label="Global Completion"
        value={`${stats?.systemCompletionRate ?? 0}%`}
        icon={TrendingUp}
        iconColor="#22c55e"
        progressPercent={stats?.systemCompletionRate ?? 0}
        subtitle="Across all registered users"
      />

      <StatCard
        label="Urgent Tasks"
        value={stats?.urgentTasksCount ?? 0}
        icon={AlertTriangle}
        iconColor="#ef4444"
        subtitle="Requiring immediate focus"
      />
    </div>
  );
}
