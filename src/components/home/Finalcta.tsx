
import HeroCtas from "./HeroCtas";
import Reveal from "./Reveal";

type Props = {
    isSignedIn: boolean;
    isAdmin: boolean;
};

export default function FinalCta({ isSignedIn, isAdmin }: Props) {
    return (
        <section className="os-final" id="get-started">
            <div className="os-final-orbit orbit-one" aria-hidden="true" />
            <div className="os-final-orbit orbit-two" aria-hidden="true" />
            <div className="os-final-orbit orbit-three" aria-hidden="true" />

            <Reveal className="os-final-content">
                <span className="os-kicker">A FRESH PAGE STARTS HERE</span>

                <h2>
                    Make today
                    <br />
                    <span>count.</span>
                </h2>

                <p>
                    {isSignedIn
                        ? "Your next small step is waiting. Pick up where you left off."
                        : "Create your own space. Find your rhythm. Make progress at your pace."}
                </p>

                <div className="os-final-actions">
                    <HeroCtas
                        isSignedIn={isSignedIn}
                        isAdmin={isAdmin}
                        idPrefix="footer"
                    />
                </div>

                <span className="os-final-footnote">
                    YOUR SPACE. YOUR PACE. YOUR PROGRESS.
                </span>
            </Reveal>
        </section>
    );
}
