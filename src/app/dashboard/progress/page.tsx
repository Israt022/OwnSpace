import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import ProgressClient from "./ProgressClient";

export const metadata: Metadata = {
  title: "Progress & Analytics | OwnSpace",
  description: "Gain actionable insights into your habits and task completion trends.",
};

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  return <ProgressClient user={sessionData.user} />;
}
