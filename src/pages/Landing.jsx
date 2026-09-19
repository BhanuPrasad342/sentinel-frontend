import { useNavigate } from "react-router-dom";

function Landing() {

    const navigate = useNavigate();
    return (
        <div className="landing">

            {/* Navigation */}
            <nav className="navbar">
                <div className="logo">
                    Sentinel<span>UBA</span>
                </div>

                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#technology">Technology</a>
                    <button
                    className="login-btn"
                    onClick={() => navigate("/login")}
                    >
                    Manager Login
                </button>
                </div>
            </nav>


            {/* Hero Section */}
            <section className="hero">

                <div className="hero-content">

                    <div className="badge">
                        ● Real-Time Insider Threat Detection
                    </div>

                    <h1>
                        Detect threats
                        <br />
                        <span>before they become incidents.</span>
                    </h1>

                    <p>
                        SentinelUBA continuously monitors endpoint activity,
                        identifies suspicious behavioral patterns, calculates
                        risk, and delivers real-time alerts to security managers.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary-btn">
                            Explore Platform →
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/login")}
                        >
                            Manager Login
                        </button>
                    </div>

                </div>


                {/* Dashboard Preview */}
                <div className="dashboard-preview">

                    <div className="preview-header">
                        <span>SentinelUBA Security Monitor</span>
                        <span className="connected">
                            ● LIVE
                        </span>
                    </div>

                    <div className="risk-card">

                        <div>
                            <small>Current Risk</small>
                            <h2>65</h2>
                            <span>HIGH RISK</span>
                        </div>

                        <div className="risk-circle">
                            65
                        </div>

                    </div>


                    <div className="preview-alert">

                        <div className="alert-icon">
                            !
                        </div>

                        <div>
                            <strong>Suspicious Activity Detected</strong>
                            <p>
                                Excessive file downloads detected
                            </p>
                        </div>

                        <span className="high-label">
                            HIGH
                        </span>

                    </div>


                    <div className="preview-alert">

                        <div className="alert-icon">
                            !
                        </div>

                        <div>
                            <strong>Unusual Login Activity</strong>
                            <p>
                                Login outside normal working hours
                            </p>
                        </div>

                        <span className="medium-label">
                            MEDIUM
                        </span>

                    </div>

                </div>

            </section>


            {/* Features */}
            <section
                className="features"
                id="features"
            >

                <div className="section-heading">

                    <span>PLATFORM CAPABILITIES</span>

                    <h2>
                        Security intelligence
                        <br />
                        built into your endpoints.
                    </h2>

                    <p>
                        SentinelUBA combines endpoint monitoring,
                        behavioral detection and real-time alerting
                        into one centralized platform.
                    </p>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">
                        <div className="feature-number">01</div>
                        <h3>Continuous Monitoring</h3>
                        <p>
                            Monitor endpoint activity including logins,
                            downloads and sensitive file interactions.
                        </p>
                    </div>


                    <div className="feature-card">
                        <div className="feature-number">02</div>
                        <h3>Behavioral Detection</h3>
                        <p>
                            Identify suspicious activity using configurable
                            detection rules and behavioral patterns.
                        </p>
                    </div>


                    <div className="feature-card">
                        <div className="feature-number">03</div>
                        <h3>Risk Scoring</h3>
                        <p>
                            Convert detected activity into risk scores
                            and severity levels for faster prioritization.
                        </p>
                    </div>


                    <div className="feature-card">
                        <div className="feature-number">04</div>
                        <h3>Real-Time Alerts</h3>
                        <p>
                            Deliver security alerts instantly to managers
                            through WebSocket-based communication.
                        </p>
                    </div>

                </div>

            </section>


            {/* How It Works */}
            <section
                className="how-it-works"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        From endpoint activity
                        <br />
                        to actionable intelligence.
                    </h2>

                </div>


                <div className="flow">

                    <div className="flow-item">
                        <div>01</div>
                        <h3>Endpoint</h3>
                        <p>
                            Activity occurs on an employee device.
                        </p>
                    </div>


                    <div className="flow-line"></div>


                    <div className="flow-item">
                        <div>02</div>
                        <h3>Sentinel Agent</h3>
                        <p>
                            The endpoint agent securely collects activity.
                        </p>
                    </div>


                    <div className="flow-line"></div>


                    <div className="flow-item">
                        <div>03</div>
                        <h3>Detection Engine</h3>
                        <p>
                            Events are analyzed against detection rules.
                        </p>
                    </div>


                    <div className="flow-line"></div>


                    <div className="flow-item">
                        <div>04</div>
                        <h3>Risk & Alert</h3>
                        <p>
                            High-risk activity generates actionable alerts.
                        </p>
                    </div>

                </div>

            </section>


            {/* Technology */}
            <section
                className="technology"
                id="technology"
            >

                <div className="section-heading">

                    <span>ENGINEERED FOR MODERN APPLICATIONS</span>

                    <h2>
                        Built with a modern
                        <br />
                        full-stack architecture.
                    </h2>

                </div>


                <div className="tech-stack">

                    <span>Java 17</span>
                    <span>Spring Boot</span>
                    <span>Spring Security</span>
                    <span>PostgreSQL</span>
                    <span>JPA / Hibernate</span>
                    <span>WebSocket / STOMP</span>
                    <span>React</span>
                    <span>Maven</span>

                </div>

            </section>


            {/* CTA */}
            <section className="cta">

                <h2>
                    Make every endpoint
                    <br />
                    part of your security strategy.
                </h2>

                <p>
                    Monitor. Detect. Respond.
                </p>

                <button className="primary-btn">
                    Explore SentinelUBA →
                </button>

            </section>


            {/* Footer */}
            <footer>

                <div className="logo">
                    Sentinel<span>UBA</span>
                </div>

                <p>
                    Insider Threat Detection & Response Platform
                </p>

                <span>
                    © 2026 SentinelUBA
                </span>

            </footer>

        </div>
    );
}

export default Landing;