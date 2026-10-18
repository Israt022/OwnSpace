import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminUsersClient from "./AdminUsersClient";

export const metadata: Metadata = {
  title: "User Management | Admin OwnSpace",
  description: "View, search, filter, and manage platform user roles.",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  if (sessionData.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminUsersClient currentAdmin={sessionData.user} />;
}
