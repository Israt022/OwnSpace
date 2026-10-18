import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  // Server-side authorization guard: only ADMINs may access /admin and subroutes
  if (sessionData.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
