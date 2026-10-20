
"use client";

import { motion, type MotionProps } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
} & Pick<MotionProps, "whileInView">;

export default function Reveal({
    children,
    className,
    delay = 0,
    whileInView = { opacity: 1, y: 0 },
}: RevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={whileInView}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
