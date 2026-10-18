"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import ActivityList from "@/components/dashboard/admin/ActivityList";
import { AdminActivityItem } from "@server/services/admin.service";
import { SessionUser } from "@/lib/session";

interface AdminActivitiesClientProps {
  adminUser: SessionUser;
}

export default function AdminActivitiesClient({ adminUser }: AdminActivitiesClientProps) {
  const [activities, setActivities] = useState<AdminActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/admin/activities");
      if (res.ok) {
        const data = await res.json();
        if (data.success) setActivities(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <DashboardShell
      user={adminUser}
      role="ADMIN"
      title="System Activities"
      subtitle="Real-time audit log of tasks created and completed across the platform."
      actions={
        <button
          onClick={fetchActivities}
          className="hero-btn-secondary"
          style={{ padding: "0.55rem 1rem", fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <RefreshCw size={14} /> Refresh Feed
        </button>
      }
    >
      <ActivityList activities={activities} loading={loading} />
    </DashboardShell>
  );
}
