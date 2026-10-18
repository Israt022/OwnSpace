import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import UserSettingsForm from "@/components/dashboard/user/UserSettingsForm";

export const metadata: Metadata = {
  title: "Settings | OwnSpace",
  description: "Configure workspace preferences, appearance, and account options.",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  const { user } = sessionData;

  return (
    <DashboardShell
      user={user}
      role="USER"
      title="Settings"
      subtitle="Manage your theme, notification feedback, and account preferences."
    >
      <UserSettingsForm user={user} />
    </DashboardShell>
  );
}
