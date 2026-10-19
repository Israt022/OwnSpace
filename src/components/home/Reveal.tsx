
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    children: React.ReactNode;
    className?: string;
    delay?: number;
};

export default function Reveal({
    children,
    className = "",
    delay = 0,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const show = () => setVisible(true);

        if (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
            !("IntersectionObserver" in window)
        ) {
            show();
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    show();
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`os-reveal ${visible ? "is-visible" : ""} ${className}`}
            style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
        >
            {children}
        </div>
    );
}
