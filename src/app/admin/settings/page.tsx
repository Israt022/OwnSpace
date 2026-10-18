import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import AdminSettingsView from "@/components/dashboard/admin/AdminSettingsView";

export const metadata: Metadata = {
  title: "Admin Settings | OwnSpace",
  description: "Platform infrastructure, security policies, and application settings.",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  if (sessionData.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { user } = sessionData;

  return (
    <DashboardShell
      user={user}
      role="ADMIN"
      title="Platform Settings"
      subtitle="Connected infrastructure, database health, and security policies."
    >
      <AdminSettingsView adminUser={user} />
    </DashboardShell>
  );
}
