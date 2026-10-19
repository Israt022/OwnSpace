
import HeroBackground from "./Herobackground";
import HeroCtas from "./HeroCtas";
import LiveTaskDemo from "./Livetaskdemo";
import TypewriterText from "./Typewritertext";

const PHRASES = [
    "plan the morning.",
    "tackle what's urgent first.",
    "check off every task.",
    "build momentum daily.",
];

type Props = {
    isSignedIn: boolean;
    isAdmin: boolean;
};

export default function Hero({ isSignedIn, isAdmin }: Props) {
    return (
        <section className="auth-bg hero-section ownspace-hero">
            <HeroBackground />

            <div className="hero-grid ownspace-hero-grid">
                <div className="hero-copy ownspace-hero-copy">
                    <div className="ownspace-eyebrow">
                        <span className="ownspace-status-dot" />
                        YOUR DAY, YOUR SPACE
                    </div>

                    <h1 className="hero-title ownspace-hero-title">
                        Make room for
                        <br />
                        <span className="ownspace-title-accent">
                            what matters.
                        </span>
                    </h1>

                    <p className="hero-typed ownspace-hero-typed">
                        Today, you can{" "}
                        <span className="ownspace-typed-highlight">
                            <TypewriterText phrases={PHRASES} />
                        </span>
                    </p>

                    <p className="hero-lead ownspace-hero-lead">
                        Your routines, goals, and ideas — all in one space
                        that works the way you do. Plan less chaotically.
                        Make progress every day.
                    </p>

                    <div className="ownspace-hero-actions">
                        <HeroCtas
                            isSignedIn={isSignedIn}
                            isAdmin={isAdmin}
                            idPrefix="hero"
                        />
                    </div>

                    <div className="ownspace-hero-proof">
                        <span className="ownspace-proof-check">✓</span>
                        <span>Make it yours.</span>
                        <span className="ownspace-proof-divider" />
                        <span className="ownspace-proof-check">✓</span>
                        <span>One day at a time.</span>
                    </div>
                </div>

                <div className="hero-demo-wrap ownspace-hero-demo">
                    <div className="ownspace-demo-caption">
                        <span className="ownspace-demo-live">
                            <span />
                            LIVE PREVIEW
                        </span>
                        <span className="ownspace-demo-date">
                            YOUR DAILY SPACE
                        </span>
                    </div>

                    <div className="ownspace-demo-frame">
                        <LiveTaskDemo />
                    </div>

                    <div className="ownspace-demo-note">
                        <span className="ownspace-note-icon">✳</span>
                        <div>
                            <strong>Your space, your rules.</strong>
                            <p>Build a routine that fits your life.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ownspace-hero-bottom" aria-hidden="true">
                <span>PLAN WITH PURPOSE</span>
                <span className="ownspace-bottom-line" />
                <span>PROGRESS AT YOUR PACE</span>
            </div>
        </section>
    );
}
