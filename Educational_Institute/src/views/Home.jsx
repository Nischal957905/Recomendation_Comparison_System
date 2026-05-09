import { Link } from "react-router-dom"

export default function Home(){

    return (
        <main className="home-page">
            <section className="home-hero">
                <div className="home-hero-copy">
                    <p className="eyebrow-text">Education comparison made simpler</p>
                    <h1>Find and compare educational institutes in Nepal with confidence.</h1>
                    <p className="home-hero-description">
                        Explore consultancies, colleges, and schools, compare options side-by-side,
                        and use reviews and filters to shortlist the right institution faster.
                    </p>
                    <div className="home-actions">
                        <Link className="primary-action" to="/institution">Browse listings</Link>
                        <Link className="secondary-action" to="/comparison">Compare institutes</Link>
                    </div>
                </div>
                <div className="home-hero-panel" aria-label="Platform highlights">
                    <div>
                        <strong>3</strong>
                        <span>Institute categories</span>
                    </div>
                    <div>
                        <strong>Filters</strong>
                        <span>Location, services, distance, and experience</span>
                    </div>
                    <div>
                        <strong>Reviews</strong>
                        <span>Positive and negative feedback summaries</span>
                    </div>
                </div>
            </section>

            <section className="home-feature-grid" aria-label="Explore platform features">
                <Link className="home-feature-card" to="/institution">
                    <span>01</span>
                    <h2>Consultancy listings</h2>
                    <p>Search consultancies by country, specialization, service mode, and opening hours.</p>
                </Link>
                <Link className="home-feature-card" to="/college">
                    <span>02</span>
                    <h2>College discovery</h2>
                    <p>Review colleges with ownership, accreditation, experience, and distance filters.</p>
                </Link>
                <Link className="home-feature-card" to="/school">
                    <span>03</span>
                    <h2>School shortlist</h2>
                    <p>Browse schools and compare practical details before making your shortlist.</p>
                </Link>
            </section>
        </main>
    )
}
