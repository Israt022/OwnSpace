import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
