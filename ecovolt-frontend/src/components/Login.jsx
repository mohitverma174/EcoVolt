import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess, onSwitchToSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Call API
            const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            
            console.log("Server Login Response:", response.data);

            // 2. Extract Data 
            // If the server doesn't send the email back, WE USE THE INPUT EMAIL
            const userData = {
                name: response.data.name || "Driver",
                role: response.data.role,
                email: email, // 👈 FORCE SAVE THE EMAIL FROM INPUT
                token: response.data.token
            };

            // 3. Save to Local Storage (Crucial)
            localStorage.setItem('jwtToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(userData));

            // 4. Update App State
            alert(`✅ Login Successful! Welcome ${userData.name}`);
            onLoginSuccess(userData); 

        } catch (error) {
            console.error("Login Error:", error);
            alert("❌ Login Failed: check email/password");
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>🔐 Login</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="Enter Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} 
                    />
                    <input 
                        type="password" 
                        placeholder="Enter Password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} 
                    />
                    
                    <button type="submit" style={{ background: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Login
                    </button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    New user? <span onClick={onSwitchToSignup} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>Create Account</span>
                </p>
            </div>
        </div>
    );
}

export default Login;