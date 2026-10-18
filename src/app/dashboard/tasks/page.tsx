import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import TasksClient from "./TasksClient";

export const metadata: Metadata = {
  title: "Tasks Management | OwnSpace",
  description: "View, filter, schedule, and execute your daily tasks.",
};

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  return <TasksClient user={sessionData.user} />;
}
