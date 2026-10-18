import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import ProfileForm from "@/components/dashboard/user/ProfileForm";

export const metadata: Metadata = {
  title: "Profile | OwnSpace",
  description: "Manage your personal account profile information.",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  const { user } = sessionData;

  return (
    <DashboardShell
      user={user}
      role="USER"
      title="User Profile"
      subtitle="View and update your personal details."
    >
      <ProfileForm user={user} />
    </DashboardShell>
  );
}
