import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import CalendarClient from "./CalendarClient";

export const metadata: Metadata = {
  title: "Calendar Schedule | OwnSpace",
  description: "View tasks organized by dates and plan upcoming days.",
};

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const sessionData = await getServerSession();

  if (!sessionData || !sessionData.user) {
    redirect("/sign-in");
  }

  return <CalendarClient user={sessionData.user} />;
}
