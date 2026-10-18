import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import ProfileForm from "@/components/dashboard/user/ProfileForm";

export const metadata: Metadata = {
  title: "Admin Profile | OwnSpace",
  description: "Update administrator credentials and profile details.",
};

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
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
      title="Admin Profile"
      subtitle="View and manage your administrator profile details."
    >
      <ProfileForm user={user} />
    </DashboardShell>
  );
}
