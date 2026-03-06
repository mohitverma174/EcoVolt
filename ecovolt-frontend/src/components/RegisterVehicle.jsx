import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterVehicle({ currentUser }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehicleType: 'E-CAR',
        vehicleNumber: '',
        currentLocation: ''
    });
    const [loading, setLoading] = useState(false);

    // 🌟 DYNAMIC TOAST STATE
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000); 
    };

    const handleChange = (e) => {
        // Automatically uppercase the license plate and city for consistency
        setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('jwtToken');
            const email = currentUser?.email || JSON.parse(localStorage.getItem('user') || '{}').email;

            if (!email) {
                showToast("Error: User email not found. Please log in again.", 'error');
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                driverEmail: email
            };

            await axios.post('http://localhost:8080/api/vehicles/register', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // 🌟 Smooth Success Toast (Replaces the alert!)
            showToast("EV Registered Successfully! Booting up dashboard...", 'success');
            
            // Wait 1.5 seconds so they can read the toast before teleporting
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error("Registration Error:", error);
            // 🌟 Smooth Error Toast
            showToast("Failed to register vehicle. It might already exist.", 'error');
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px', position: 'relative' }}>
            
            {/* 🌟 DYNAMIC TOAST NOTIFICATION */}
            {toast.show && (
                <div style={{
                    position: 'fixed', top: '40px', left: '50%', transform: 'translateX(-50%)',
                    background: toast.type === 'error' ? '#ff4757' : '#2ed573',
                    color: 'white', padding: '15px 30px', borderRadius: '30px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)', zIndex: 9999,
                    fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.3s ease-in-out'
                }}>
                    {toast.type === 'error' ? '❌' : '✅'} {toast.message}
                </div>
            )}

            <div style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px', borderTop: '5px solid #0fb9b1' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#1e272e', margin: '0 0 10px 0', fontSize: '28px' }}>🚗 Add Your EV</h1>
                    <p style={{ color: '#576574', margin: 0, fontSize: '15px' }}>Register your vehicle to start receiving rides on EcoVolt.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '8px', fontSize: '14px' }}>Vehicle Category</label>
                        <select 
                            name="vehicleType" 
                            value={formData.vehicleType} 
                            onChange={handleChange} 
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d2dae2', fontSize: '16px', backgroundColor: '#f8f9fa' }}
                        >
                            <option value="E-CAR">E-Car (Premium 4-Seater)</option>
                            <option value="E-BIKE">E-Bike (Fast 1-Seater)</option>
                            <option value="E-RICKSHAW">E-Rickshaw (Economy)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '8px', fontSize: '14px' }}>License Plate Number</label>
                        <input 
                            type="text" 
                            name="vehicleNumber" 
                            placeholder="e.g., MP09-EV-1234" 
                            value={formData.vehicleNumber} 
                            onChange={handleChange} 
                            required 
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d2dae2', fontSize: '16px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', color: '#34495e', marginBottom: '8px', fontSize: '14px' }}>Current City (Base Location)</label>
                        <input 
                            type="text" 
                            name="currentLocation" 
                            placeholder="e.g., INDORE" 
                            value={formData.currentLocation} 
                            onChange={handleChange} 
                            required 
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d2dae2', fontSize: '16px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate('/dashboard')}
                            style={{ flex: 1, background: '#f1f2f6', color: '#57606f', padding: '15px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ flex: 2, background: '#0fb9b1', color: 'white', padding: '15px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(15, 185, 177, 0.3)' }}
                        >
                            {loading ? "Registering..." : "Activate My EV"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterVehicle;