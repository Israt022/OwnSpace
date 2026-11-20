import Link from "next/link";
import Image from "next/image";

type OwnSpaceLogoProps = {
  href?: string;
  showText?: boolean;
  size?: number;
  className?: string;
  textClassName?: string;
};

export default function OwnSpaceLogo({
  href = "/",
  showText = true,
  size = 36,
  className = "",
  textClassName = "",
}: OwnSpaceLogoProps) {
  return (
    <Link
      href={href}
      aria-label="OwnSpace home"
      className={`group inline-flex shrink-0 items-center gap-2.5 no-underline ${className}`}
    >
      {/* Official OwnSpace 3D isometric portal mark */}
      <span
        className="relative flex shrink-0 items-center justify-center transition-transform duration-200 ease-out group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/LOGO/ownspace-icon.png"
          alt="OwnSpace logo"
          width={size * 2}
          height={size * 2}
          priority
          className="h-full w-full object-contain select-none"
        />
      </span>

      {showText && (
        <span
          className={`whitespace-nowrap text-[1.32rem] font-extrabold tracking-[-0.035em] text-[var(--color-text)] select-none transition-colors duration-200 ${textClassName}`}
        >
          Own<span className="text-indigo-600 dark:text-indigo-400">Space</span>
        </span>
      )}
    </Link>
  );
}
