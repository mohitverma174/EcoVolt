import { useState } from 'react';
import axios from 'axios';

function Signup({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'PASSENGER' // Default role
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/signup', formData);
            alert("✅ Account Created! Please Login.");
            onSwitchToLogin(); // Go to Login page automatically
        } catch (error) {
            alert("Error: " + (error.response?.data || "Signup failed"));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2>📝 Create Account</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input name="name" placeholder="Full Name" onChange={handleChange} required style={{ padding: '10px' }} />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={{ padding: '10px' }} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ padding: '10px' }} />
                <input name="phone" placeholder="Phone Number" onChange={handleChange} required style={{ padding: '10px' }} />
                
                <label>I am a:</label>
                <select name="role" value={formData.role} onChange={handleChange} style={{ padding: '10px' }}>
                    <option value="PASSENGER">👤 Passenger</option>
                    <option value="DRIVER">🚖 Driver</option>
                </select>

                <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
                    Sign Up
                </button>
            </form>
            <p style={{ textAlign: 'center' }}>
                Already have an account? <span onClick={onSwitchToLogin} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Login</span>
            </p>
        </div>
    );
}

export default Signup;