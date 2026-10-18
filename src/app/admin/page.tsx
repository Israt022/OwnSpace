import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminOverviewClient from "./AdminOverviewClient";

export const metadata: Metadata = {
  title: "Admin Overview | OwnSpace",
  description: "Platform oversight, system metrics, and operational control.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  if (sessionData.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminOverviewClient user={sessionData.user} />;
}
