import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import UserDashboard from "@/components/dashboard/UserDashboard";

export const metadata: Metadata = {
  title: "Daily Tasks Dashboard | OwnSpace",
  description: "Track your daily tasks, stay consistent, and accomplish your goals.",
};

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const sessionData = await getServerSession();

  // If not authenticated, redirect to sign-in
  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  const { user } = sessionData;
  const searchParams = await props.searchParams;

  // Role-based redirect:
  // If user is an ADMIN and didn't explicitly request personal user view (?view=user),
  // automatically route them to the Admin Dashboard.
  if (user.role === "ADMIN" && searchParams.view !== "user") {
    redirect("/admin");
  }

  return (
    <main style={{ minHeight: "calc(100vh - var(--navbar-h))", background: "var(--background)" }}>
      <UserDashboard user={user} />
    </main>
  );
}
