import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiMapPin, FiSearch } from "react-icons/fi";

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
                <div className="hero-panel" aria-label="Recommendation highlights">
                    <div className="hero-metric">
                        <strong>3</strong>
                        <span>Institution types</span>
                    </div>
                    <div className="hero-metric">
                        <strong>10</strong>
                        <span>Top ranked picks</span>
                    </div>
                    <div className="hero-metric wide">
                        <strong>Smart filters</strong>
                        <span>Country, accreditation, ownership, experience, online service, and distance.</span>
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

            <section className="content-band">
                <div>
                    <span className="eyebrow">How it helps</span>
                    <h2>Move from scattered research to confident comparison.</h2>
                </div>
                <div className="value-list">
                    <p>Use search when you already know a name, or filters when you are exploring options.</p>
                    <p>Open detail pages for reviews, location, program strengths, and quick facts.</p>
                    <p>Compare institutions side by side to understand where each option performs best.</p>
                </div>
            </section>
        </main>
    )
}
