
import Reveal from "./Reveal";

type PublicPageIntroProps = {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
};

export default function PublicPageIntro({
    eyebrow,
    title,
    accent,
    description,
}: PublicPageIntroProps) {
    return (
        <Reveal className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-400">
                {eyebrow}
            </p>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.12] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {title}{" "}
                <span className="text-indigo-600 dark:text-indigo-400">{accent}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
                {description}
            </p>
        </Reveal>
    );
}
