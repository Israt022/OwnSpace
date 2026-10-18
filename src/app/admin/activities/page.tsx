import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminActivitiesClient from "./AdminActivitiesClient";

export const metadata: Metadata = {
  title: "System Activities | Admin OwnSpace",
  description: "Live feed of user actions and task completions across the platform.",
};

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  if (sessionData.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminActivitiesClient adminUser={sessionData.user} />;
}
