
import Link from "next/link";

type OwnSpaceLogoProps = {
    href?: string;
    showText?: boolean;
    size?: number;
    className?: string;
};

export default function OwnSpaceLogo({
    href = "/",
    showText = true,
    size = 40,
    className = "",
}: OwnSpaceLogoProps) {
    return (
        <Link
            href={href}
            aria-label="OwnSpace home"
            className={`group inline-flex shrink-0 items-center gap-2.5 no-underline ${className}`}
        >
            {/* Custom OwnSpace icon */}
            <span
                className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105"
                style={{ width: size, height: size }}
            >
                <svg
                    viewBox="0 0 40 40"
                    width={size * 0.72}
                    height={size * 0.72}
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M20 3.5 36.5 20 20 36.5 3.5 20 20 3.5Z"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    <circle cx="20" cy="20" r="7" fill="white" />
                    <circle cx="20" cy="20" r="3" fill="#6366f1" />
                </svg>
            </span>

            {showText && (
                <span className="whitespace-nowrap text-[1.35rem] font-extrabold tracking-[-0.055em] text-[var(--color-text)]">
                    Own<span className="text-indigo-400">Space</span>
                    <span className="ml-1 align-top text-[9px] font-semibold tracking-normal text-indigo-400">
                        ®
                    </span>
                </span>
            )}
        </Link>
    );
}
