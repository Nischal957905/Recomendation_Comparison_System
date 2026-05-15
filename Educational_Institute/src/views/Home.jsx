import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiMapPin, FiSearch } from "react-icons/fi";

export default function Home(){

    return (
        <main className="home-page">
            <section className="hero-section">
                <div className="hero-copy">
                    <span className="eyebrow">Education recommendations for Nepal</span>
                    <h1>Find institutions that match your goals, budget, and location.</h1>
                    <p>
                        Compare consultancies, colleges, and schools with practical filters,
                        performance signals, reviews, and location-aware details in one clean workspace.
                    </p>
                    <div className="hero-actions">
                        <Link className="primary-action" to="/institution">
                            Browse listings <FiArrowRight />
                        </Link>
                        <Link className="secondary-action" to="/comparison">
                            Compare institutions
                        </Link>
                    </div>
                </div>
                <div className="hero-media hero-media-single" aria-label="Featured education comparison visual">
                    <img
                        className="hero-media-main"
                        src="/images/home-hero-generated.png"
                        alt="Students comparing education options on a modern digital dashboard"
                    />
                    <div className="hero-score-card">
                        <strong>10</strong>
                        <span>Top ranked picks</span>
                    </div>
                </div>
            </section>

            <section className="category-grid" aria-label="Explore categories">
                <Link className="category-card" to="/institution">
                    <FiSearch />
                    <h2>Consultancies</h2>
                    <p>Review destinations served, university partnerships, success history, classes, and service availability.</p>
                </Link>
                <Link className="category-card" to="/college">
                    <FiBarChart2 />
                    <h2>Colleges</h2>
                    <p>Shortlist colleges by accreditation, ownership, establishment history, experience, and student feedback.</p>
                </Link>
                <Link className="category-card" to="/school">
                    <FiMapPin />
                    <h2>Schools</h2>
                    <p>Explore schools by academic board, ownership type, distance, and profile details before visiting.</p>
                </Link>
            </section>

            <section className="home-feature">
                <div className="home-feature-media">
                    <img
                        src="/images/home-comparison-generated.png"
                        alt="Education comparison planning workspace"
                    />
                </div>
                <div className="home-feature-copy">
                    <span className="eyebrow">How it helps</span>
                    <h2>Move from scattered research to confident comparison.</h2>
                    <div className="value-list">
                        <p><FiCheckCircle /> Use search when you already know a name, or filters when you are exploring options.</p>
                        <p><FiCheckCircle /> Open detail pages for reviews, location, program strengths, and quick facts.</p>
                        <p><FiCheckCircle /> Compare institutions side by side to understand where each option performs best.</p>
                    </div>
                </div>
            </section>
        </main>
    )
}
