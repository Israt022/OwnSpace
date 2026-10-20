
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Database, Eye, LockKeyhole, UserRound } from "lucide-react";

const sections = [
    { icon: UserRound, title: "Account information", text: "OwnSpace uses account information, such as your name and email address, to support authentication and your personalized experience." },
    { icon: Database, title: "Task information", text: "Tasks you create may include titles, descriptions, priorities, due dates, due times, and completion status. This information supports task management and progress tracking." },
    { icon: Eye, title: "How information is used", text: "Account and task information supports sign-in, your personal dashboard, task organization, and the administrator functions provided by the application." },
    { icon: LockKeyhole, title: "Access and account safety", text: "OwnSpace uses authentication and role-based access for user and administrator experiences. Keep your sign-in credentials private and sign out when using a shared device." },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-900 dark:bg-[#090d18] dark:text-white sm:px-8 sm:py-24">
            <div className="mx-auto max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-600 dark:hover:text-indigo-300">
                        <ArrowLeft size={16} /> Back to home
                    </Link>
                    <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">OwnSpace policies</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
                    <p className="mt-5 max-w-2xl leading-8 text-slate-600 dark:text-slate-400">
                        This page explains the types of account and task information used by OwnSpace and how that information supports the application's features.
                    </p>
                </motion.div>

                <div className="mt-12 space-y-4">
                    {sections.map(({ icon: Icon, title, text }, index) => (
                        <motion.section key={title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.05 }} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-white/[0.025] sm:gap-5 sm:p-6">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"><Icon size={21} /></span>
                            <div>
                                <h2 className="font-semibold">{title}</h2>
                                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{text}</p>
                            </div>
                        </motion.section>
                    ))}
                </div>

                <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 dark:border-indigo-400/20 dark:bg-indigo-500/[0.06]">
                    <h2 className="font-semibold">Managing your information</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        You can manage tasks through your dashboard. Before making OwnSpace publicly available, ensure this policy also reflects your actual data-retention, account-deletion, and contact procedures.
                    </p>
                </motion.section>
            </div>
        </main>
    );
}
