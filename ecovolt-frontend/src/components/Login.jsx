import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess, onSwitchToSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Call the API
            const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            
            // 2. Extract Token and User from the new Backend response
            const { token, user } = response.data;

            // 3. Save Token to LocalStorage (So you stay logged in)
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            // 4. Tell the App you are logged in
            alert(`Welcome back, ${user.name}!`);
            onLoginSuccess(user); 

        } catch (error) {
            console.error("Login Error:", error);
            alert("❌ Login Failed: Invalid Email or Password");
        }
    };

    return (
        /* OVERLAY CONTAINER: Forces this to be the top-most layer */
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f2f5', // Covers any black shadow behind it
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999 // The highest possible layer
        }}>
            {/* LOGIN BOX */}
            <div style={{ 
                width: '100%',
                maxWidth: '400px', 
                padding: '30px', 
                backgroundColor: 'white', 
                borderRadius: '10px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: 10000 
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>🔐 Login to EcoVolt</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="Enter Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} 
                    />
                    <input 
                        type="password" 
                        placeholder="Enter Password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} 
                    />
                    
                    <button type="submit" style={{ background: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
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