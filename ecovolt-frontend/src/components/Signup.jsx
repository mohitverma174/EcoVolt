import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'PASSENGER' // Default role
    });
    const [loading, setLoading] = useState(false);

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
            await axios.post('https://ecovolt-r0js.onrender.com/api/auth/signup', formData);
            
            showToast('Account created successfully! Redirecting...', 'success');
            
            setTimeout(() => {
                navigate('/login'); 
            }, 1500);
            
        } catch (error) {
            console.error("Signup Error:", error);
            const errorMsg = error.response?.data?.message || "Signup failed. Please try again.";
            
            
            showToast(errorMsg, 'error');
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#f8fdf9', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            
            {toast.show && (
                <div style={{
                    position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)',
                    background: toast.type === 'error' ? '#ff4757' : '#2ed573',
                    color: 'white', padding: '15px 30px', borderRadius: '30px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)', zIndex: 10000,
                    fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.3s ease-in-out'
                }}>
                    {toast.type === 'error' ? '❌' : '✅'} {toast.message}
                </div>
            )}

            <div style={{ width: '100%', maxWidth: '400px', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#28a745' }}>🌱 Join EcoVolt</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Create an account to get started</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Full Name"
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} 
                    />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email Address"
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} 
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Create Password"
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} 
                    />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>I want to:</label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', backgroundColor: 'white' }}
                        >
                            <option value="PASSENGER">Book Rides (Passenger)</option>
                            <option value="DRIVER">Drive an EV (Driver)</option>
                        </select>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            background: '#28a745', color: 'white', padding: '14px', border: 'none', 
                            borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', 
                            fontWeight: 'bold', fontSize: '16px', marginTop: '10px', transition: '0.2s' 
                        }}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
                    Already have an account? <Link to="/login" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;