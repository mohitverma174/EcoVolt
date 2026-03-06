import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#333', overflowX: 'hidden' }}>
            
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', position: 'fixed', width: '90%', top: 0, zIndex: 1000, boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
                <div 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ fontSize: '28px', fontWeight: '900', color: '#28a745', letterSpacing: '-1px', cursor: 'pointer' }}
                >
                    🌱 EcoVolt
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={() => navigate('/login')}
                        style={{ background: 'transparent', border: 'none', color: '#555', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', padding: '10px 20px', borderRadius: '30px', transition: '0.2s' }}
                    >
                        Log In
                    </button>
                    <button 
                        onClick={() => navigate('/signup')}
                        style={{ background: '#28a745', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', padding: '10px 25px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)', transition: '0.2s' }}
                    >
                        Sign Up
                    </button>
                </div>
            </nav>

            <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #eefcf1 0%, #f4f7f6 100%)', textAlign: 'center', padding: '100px 20px 50px 20px' }}>
                <div style={{ background: '#d4edda', color: '#155724', padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '14px', marginBottom: '25px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    ⚡ Now live in Indore
                </div>
                <h1 style={{ fontSize: '60px', fontWeight: '900', color: '#1e272e', margin: '0 0 20px 0', lineHeight: '1.1', maxWidth: '800px' }}>
                    The future of commuting is <span style={{ color: '#28a745' }}>Electric.</span>
                </h1>
                <p style={{ fontSize: '20px', color: '#576574', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}>
                    Zero emissions. Fair pricing. Instant ride matching. Join the green revolution and change the way you move around the city.
                </p>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button 
                        onClick={() => navigate('/signup')}
                        style={{ background: '#28a745', color: 'white', padding: '18px 40px', borderRadius: '30px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(40, 167, 69, 0.4)', transition: 'transform 0.2s' }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Book a Ride
                    </button>
                    <button 
                        onClick={() => navigate('/signup')}
                        style={{ background: 'white', color: '#1e272e', padding: '18px 40px', borderRadius: '30px', border: '2px solid #d2dae2', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.target.style.borderColor = '#28a745'; e.target.style.color = '#28a745'; }}
                        onMouseOut={(e) => { e.target.style.borderColor = '#d2dae2'; e.target.style.color = '#1e272e'; }}
                    >
                        Drive an EV
                    </button>
                </div>
            </header>

            {/* 💡 FEATURES SECTION */}
            <section style={{ padding: '80px 5%', background: 'white', textAlign: 'center' }}>
                <h2 style={{ fontSize: '36px', color: '#1e272e', marginBottom: '60px' }}>Why choose EcoVolt?</h2>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    {/* Feature 1 */}
                    <div style={{ flex: '1 1 300px', padding: '40px', background: '#f8fdf9', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🍃</div>
                        <h3 style={{ fontSize: '22px', color: '#1e272e', marginBottom: '15px' }}>Zero Tailpipe Emissions</h3>
                        <p style={{ color: '#576574', lineHeight: '1.6' }}>
                            Every ride helps reduce the city's carbon footprint. On average, choosing an EV saves over <strong style={{color: '#28a745'}}>1,500 kg of CO₂</strong> per year compared to a petrol car.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div style={{ flex: '1 1 300px', padding: '40px', background: '#f8fdf9', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🤝</div>
                        <h3 style={{ fontSize: '22px', color: '#1e272e', marginBottom: '15px' }}>Smart Carpooling</h3>
                        <p style={{ color: '#576574', lineHeight: '1.6' }}>Share your ride with others heading in the same direction. Save money while saving the planet.</p>
                    </div>

                    {/* Feature 3 */}
                    <div style={{ flex: '1 1 300px', padding: '40px', background: '#f8fdf9', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '50px', marginBottom: '20px' }}>💳</div>
                        <h3 style={{ fontSize: '22px', color: '#1e272e', marginBottom: '15px' }}>No Surge Pricing</h3>
                        <p style={{ color: '#576574', lineHeight: '1.6' }}>Honest, transparent pricing always. What you see is what you pay, no matter the time of day.</p>
                    </div>
                </div>
            </section>

            <footer style={{ background: '#1e272e', color: 'white', padding: '40px 5%', textAlign: 'center' }}>
                <h2 style={{ color: '#28a745', margin: '0 0 10px 0' }}>🌱 EcoVolt</h2>
                <p style={{ color: '#a4b0be', marginBottom: '30px' }}>Driving a greener tomorrow.</p>
                <div style={{ color: '#747d8c', fontSize: '14px', borderTop: '1px solid #2f3542', paddingTop: '20px' }}>
                    © {new Date().getFullYear()} EcoVolt Platform. MCA Final Year Project.
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;