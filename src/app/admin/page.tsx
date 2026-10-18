import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | OwnSpace",
  description: "Platform oversight, user management, and global metrics.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const sessionData = await getServerSession();

  // If not authenticated, redirect to sign-in
  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  const { user } = sessionData;

  // Role protection: Only users with role === 'ADMIN' can access this page
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <main style={{ minHeight: "calc(100vh - var(--navbar-h))", background: "var(--background)" }}>
      <AdminDashboard adminUser={user} />
    </main>
  );
}
