"use client";

import { useEffect, useState } from "react";

type Props = {
    phrases: string[];
    typeMs?: number;
    deleteMs?: number;
    holdMs?: number;
};

/** Types and deletes a rotating list of phrases. Static if reduced-motion. */
export default function TypewriterText({
    phrases,
    typeMs = 55,
    deleteMs = 28,
    holdMs = 1400,
}: Props) {
    const [index, setIndex] = useState(0);
    const [text, setText] = useState(phrases[0]); // SSR shows full first phrase
    const [mode, setMode] = useState<"hold" | "deleting" | "typing">("hold");
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }, []);

    useEffect(() => {
        if (reduced) return;
        const full = phrases[index];
        let t: ReturnType<typeof setTimeout>;

        if (mode === "hold") {
            t = setTimeout(() => setMode("deleting"), holdMs);
        } else if (mode === "deleting") {
            if (text.length === 0) {
                setIndex((i) => (i + 1) % phrases.length);
                setMode("typing");
            } else {
                t = setTimeout(() => setText(text.slice(0, -1)), deleteMs);
            }
        } else {
            if (text === full) setMode("hold");
            else t = setTimeout(() => setText(full.slice(0, text.length + 1)), typeMs);
        }
        return () => clearTimeout(t);
    }, [text, mode, index, reduced, phrases, typeMs, deleteMs, holdMs]);

    return (
        <span className="typewriter">
            {text}
            <span className="typewriter-caret" aria-hidden="true" />
        </span>
    );
}