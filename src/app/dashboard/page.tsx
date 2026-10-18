import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import OverviewClient from "./OverviewClient";

export const metadata: Metadata = {
  title: "Dashboard Overview | OwnSpace",
  description: "Track your daily tasks and productivity momentum.",
};

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  const { user } = sessionData;
  const searchParams = await props.searchParams;

  // Role-based automatic redirect:
  // If user is ADMIN and didn't explicitly request personal view (?view=user), route to /admin
  if (user.role === "ADMIN" && searchParams.view !== "user") {
    redirect("/admin");
  }

  return <OverviewClient user={user} />;
}
