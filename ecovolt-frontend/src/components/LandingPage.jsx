import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-container">
            {/* Navigation Bar */}
            <nav className="landing-nav">
                <div className="logo">🌱 EcoVolt</div>
                <div className="nav-links">
                    <Link to="/login" className="nav-login">Log In</Link>
                    <Link to="/signup" className="nav-signup">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Smarter, greener rides for your city.</h1>
                    <p>
                        Whether you are commuting across Indore or heading to campus, 
                        EcoVolt offers zero-emission EV rides at your fingertips. 
                        Join the revolution.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/login" className="btn-primary">Book a Ride</Link>
                        <Link to="/login" className="btn-secondary">Drive with Us</Link>
                    </div>
                </div>
                
                {/* Mobile-friendly hero image graphic */}
                <div className="hero-graphic">
                    <div className="mock-phone">
                        <div className="phone-screen">
                            <div className="pulse-dot"></div>
                            <p>Finding nearby EVs...</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="features-section">
                <div className="feature-card">
                    <h3>⚡ 100% Electric</h3>
                    <p>Zero emissions. Breathe cleaner air while you travel.</p>
                </div>
                <div className="feature-card">
                    <h3>📱 Smart Dispatch</h3>
                    <p>Real-time matching with the closest available drivers.</p>
                </div>
                <div className="feature-card">
                    <h3>💸 Fair Pricing</h3>
                    <p>No surge pricing tricks. Transparent fares from start to finish.</p>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;