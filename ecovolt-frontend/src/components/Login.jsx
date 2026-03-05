import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    // Dynamic Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000); 
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            
            // 🔍 DEBUG: See exactly what Java is sending back in the browser console
            console.log("Backend Response:", response.data); 

            // 1. Safely grab the token (handles both {token: "..."} and raw "eyJ..." string)
            const token = response.data.token || response.data;
            localStorage.setItem('jwtToken', token);
            
            // 🚨 2. THE FIX: If Java didn't send a user object, we will build a temporary one!
            let userData = response.data.user;
            
            if (!userData) {
                console.warn("Java didn't send user details. Building a fallback profile.");
                // Temporary fallback so you don't get stuck on the login screen
                userData = { 
                    email: formData.email, 
                    name: "EcoVolt User",
                    // Hack: If the email has 'driver' in it, make them a driver, else passenger
                    role: formData.email.toLowerCase().includes('driver') ? 'DRIVER' : 'PASSENGER' 
                };
            }

            // 3. Save to local storage
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 4. Tell App.jsx that we are officially logged in
            if (onLogin) {
                onLogin(userData);
            }

            // 5. Success Toast & Redirect
            showToast("Welcome back!", 'success');
            navigate('/dashboard');

        } catch (error) {
            console.error("Login Error:", error);
            showToast("Invalid email or password. Please try again.", 'error');
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', position: 'relative' }}>
            
            {toast.show && (
                <div style={{
                    position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)',
                    background: toast.type === 'error' ? '#ff4757' : '#2ed573',
                    color: 'white', padding: '15px 30px', borderRadius: '30px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)', zIndex: 9999,
                    fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.3s ease-in-out'
                }}>
                    {toast.type === 'error' ? '❌' : '✅'} {toast.message}
                </div>
            )}

            <div style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#28a745', margin: '0 0 10px 0' }}>🌱 EcoVolt</h1>
                    <h2 style={{ color: '#333', margin: 0 }}>Welcome Back</h2>
                    <p style={{ color: '#777', marginTop: '5px' }}>Log in to continue your journey.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="e.g. example@ecovolt.com" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            background: '#28a745', color: 'white', padding: '15px', 
                            borderRadius: '8px', border: 'none', fontSize: '18px', 
                            fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', 
                            marginTop: '10px', transition: '0.3s' 
                        }}
                    >
                        {loading ? "Authenticating..." : "Log In"}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;