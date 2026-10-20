
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PublicPageIntro from "@/components/public/PublicPageIntro";
import Reveal from "@/components/public/Reveal";

const policies = [
    { id: "information", title: "01. Information used", text: "OwnSpace may process account details such as your name and email address, along with the task information you create, including titles, descriptions, priorities, due dates, and completion status." },
    { id: "usage", title: "02. How information is used", text: "This information supports authentication, your personalized workspace, task organization, date-based planning, and the platform features available to your account role." },
    { id: "access", title: "03. Access and permissions", text: "Your account provides access to personalized features. Administrative features are intended for authorized administrators. Do not share your sign-in credentials with others." },
    { id: "responsibility", title: "04. Your responsibility", text: "Keep your account credentials secure and sign out when using a shared device. Review your tasks and account information regularly to ensure they remain accurate." },
    { id: "updates", title: "05. Policy updates", text: "This policy may be updated as OwnSpace develops. The published version should reflect the application's actual data handling and account-management practices." },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-5 py-20 text-slate-900 dark:bg-[#090d18] dark:text-white sm:px-10 sm:py-28">
            <div className="mx-auto max-w-6xl">
                <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-600 dark:hover:text-indigo-400">
                    <ArrowLeft size={16} /> Back to home
                </Link>

                <PublicPageIntro
                    eyebrow="Your information matters"
                    title="Privacy should be"
                    accent="clear."
                    description="This policy outlines how account and task information relates to the features provided by OwnSpace."
                />

                <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>OwnSpace Privacy Policy</span>
                    <span className="h-1 w-1 rounded-full bg-indigo-500" />
                    <span>Account & workspace information</span>
                </div>

                <div className="mt-16 grid gap-12 border-t border-slate-200 pt-10 dark:border-white/10 md:grid-cols-[220px_1fr] md:gap-20">
                    <aside className="h-fit md:sticky md:top-24">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">On this page</p>
                        <nav className="mt-5 flex flex-col gap-4">
                            {policies.map((policy) => (
                                <a key={policy.id} href={`#${policy.id}`} className="group flex items-center justify-between gap-3 text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                                    {policy.title.replace(/^\d+\.\s/, "")}
                                    <ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100" />
                                </a>
                            ))}
                        </nav>
                    </aside>

                    <div>
                        {policies.map((policy, index) => (
                            <Reveal key={policy.id} delay={index * 0.04}>
                                <section id={policy.id} className="scroll-mt-24 border-b border-slate-200 py-8 first:pt-0 dark:border-white/10">
                                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{policy.title}</h2>
                                    <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 dark:text-slate-400">{policy.text}</p>
                                </section>
                            </Reveal>
                        ))}

                        <p className="mt-8 text-xs leading-6 text-slate-500 dark:text-slate-500">
                            Before public release, verify that this policy matches your actual authentication, data storage, retention, and account deletion procedures.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
