
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Home,
    Search,
    Sparkles,
} from "lucide-react";

const floatingItems = [
    { top: "12%", left: "12%", delay: 0, icon: "✳" },
    { top: "22%", right: "13%", delay: 0.8, icon: "✦" },
    { bottom: "20%", left: "16%", delay: 1.4, icon: "✧" },
    { bottom: "15%", right: "15%", delay: 0.5, icon: "✳" },
];

export default function NotFound() {
    return (
        <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#090d18] px-5 py-20 text-[#f1f5f9]">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.07] blur-[120px]" />

                <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#a5b4fc_1px,transparent_1px)] [background-size:32px_32px]" />

                {floatingItems.map((item, index) => (
                    <motion.span
                        key={index}
                        className="absolute text-xl text-indigo-300/60"
                        style={{
                            top: item.top,
                            left: item.left,
                            right: item.right,
                            bottom: item.bottom,
                        }}
                        animate={{
                            y: [0, -16, 0],
                            rotate: [0, 12, -12, 0],
                            opacity: [0.35, 0.9, 0.35],
                        }}
                        transition={{
                            duration: 4 + index,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: item.delay,
                        }}
                    >
                        {item.icon}
                    </motion.span>
                ))}
            </div>

            <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
                {/* Animated 404 illustration */}
                <motion.div
                    initial={{ opacity: 0, y: 25, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative mx-auto mb-8 flex h-56 items-center justify-center sm:h-72"
                >
                    {/* Orbit rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 35,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute h-48 w-48 rounded-full border border-indigo-300/15 sm:h-64 sm:w-64"
                    >
                        <span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-indigo-300 shadow-[0_0_20px_#818cf8]" />
                    </motion.div>

                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 48,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute h-60 w-60 rounded-full border border-dashed border-indigo-300/10 sm:h-80 sm:w-80"
                    >
                        <span className="absolute bottom-8 right-3 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_14px_#a78bfa]" />
                    </motion.div>

                    {/* 404 typography */}
                    <div className="relative flex items-center justify-center gap-1 sm:gap-3">
                        {["4", "0", "4"].map((number, index) => (
                            <motion.span
                                key={index}
                                animate={{
                                    y: index === 1 ? [0, -10, 0] : [0, 4, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    delay: index * 0.2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="select-none text-[100px] font-black leading-none tracking-[-0.09em] text-transparent sm:text-[160px]"
                                style={{
                                    WebkitTextStroke: "1.5px #a5b4fc",
                                    filter: "drop-shadow(0 0 28px rgba(129,140,248,0.15))",
                                }}
                            >
                                {number}
                            </motion.span>
                        ))}
                    </div>

                    {/* Floating task indicator */}
                    <motion.div
                        animate={{ y: [0, -8, 0], rotate: [-3, 2, -3] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-4 right-[8%] flex items-center gap-3 rounded-xl border border-indigo-300/15 bg-[#101629]/90 px-3 py-2.5 shadow-xl backdrop-blur-xl sm:bottom-8 sm:right-[14%]"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-400/10 text-indigo-300">
                            <Sparkles size={16} />
                        </span>
                        <div className="text-left">
                            <p className="text-xs font-semibold">Lost your way?</p>
                            <p className="mt-1 text-[10px] text-slate-400">
                                Let’s get you back
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-indigo-400/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                        <Search size={13} />
                        Error 404 · Page not found
                    </span>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                        Looks like you’re{" "}
                        <span className="text-indigo-300">off track.</span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#929bb0] sm:text-base">
                        The page you’re looking for doesn’t exist or may have moved.
                        No worries — every journey has a little detour.
                    </p>

                    {/* Actions */}
                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="group inline-flex min-w-44 items-center justify-center gap-2 rounded-full bg-indigo-300 px-6 py-3.5 text-sm font-semibold text-[#090d18] transition-all duration-300 hover:bg-indigo-200 hover:shadow-[0_0_30px_rgba(165,180,252,0.2)]"
                        >
                            <Home size={16} />
                            Back to home
                            <ArrowRight
                                size={15}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-indigo-300/40 hover:bg-white/[0.04] hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Go back
                        </button>
                    </div>

                    <p className="mt-12 text-xs tracking-wide text-slate-600">
                        <span className="font-semibold text-slate-500">OWNSPACE</span>
                        {" "}· Find your focus. Own your day.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
