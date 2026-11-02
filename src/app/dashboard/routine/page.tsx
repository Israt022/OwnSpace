import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import RoutineClient from "./RoutineClient";

export const metadata: Metadata = {
  title: "Routine Planner | OwnSpace",
  description: "Design, organize, and track structured recurring daily and weekly routines.",
};

export const dynamic = "force-dynamic";

export default async function RoutinePage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  return <RoutineClient user={sessionData.user} />;
}

