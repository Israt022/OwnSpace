import type { Metadata } from "next";
import { getServerSession } from "@/lib/session";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/Howitworks";
import Roles from "@/components/home/Roles";
import FinalCta from "@/components/home/Finalcta";
import PlatformStats from "@/components/home/PlatformStats";

export const metadata: Metadata = {
  title: "OwnSpace — Daily Task Tracking & Personal Productivity",
};

export const dynamic = "force-dynamic";

/** Home page — Server Component. Only composes sections. */
export default async function Home() {
  const sessionData = await getServerSession();
  const user = sessionData?.user;
  const auth = { isSignedIn: !!user, isAdmin: user?.role === "ADMIN" };

  return (
    <>
      <Hero {...auth} />
      <PlatformStats />
      <Features />
      <HowItWorks />
      <Roles />
      <FinalCta {...auth} />
    </>
  );
}