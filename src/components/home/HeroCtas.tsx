import Link from "next/link";

type Props = {
    isSignedIn: boolean;
    isAdmin: boolean;
    /** keeps element ids unique when used in more than one section */
    idPrefix: string;
};

function Arrow() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}

/** Auth-aware call-to-action buttons (Server Component). */
export default function HeroCtas({ isSignedIn, isAdmin, idPrefix }: Props) {
    if (isSignedIn) {
        return (
            <div className="cta-row">
                <Link href={isAdmin ? "/admin" : "/dashboard"} id={`${idPrefix}-dashboard-btn`} className="hero-btn-primary">
                    {isAdmin ? "Open Admin Dashboard" : "Open Daily Task Dashboard"}
                    <Arrow />
                </Link>
                {isAdmin && (
                    <Link href="/dashboard?view=user" id={`${idPrefix}-user-tasks-btn`} className="hero-btn-secondary">
                        My Personal Tasks
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="cta-row">
            <Link href="/sign-up" id={`${idPrefix}-signup-btn`} className="hero-btn-primary">
                Get Started Free
                <Arrow />
            </Link>
            <Link href="/sign-in" id={`${idPrefix}-signin-btn`} className="hero-btn-secondary">
                Sign In
            </Link>
        </div>
    );
}