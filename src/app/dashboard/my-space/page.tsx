import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import MySpaceWidgets from "@/components/dashboard/user/MySpaceWidgets";

export const metadata: Metadata = {
  title: "My Space | OwnSpace",
  description: "Personal focus, habit routines, and scratchpad workspace.",
};

export const dynamic = "force-dynamic";

export default async function MySpacePage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  const { user } = sessionData;

  return (
    <DashboardShell
      user={user}
      role="USER"
      title="My Space"
      subtitle="Your customizable personal routine, habits, and focus board."
    >
      <MySpaceWidgets user={user} />
    </DashboardShell>
  );
}
