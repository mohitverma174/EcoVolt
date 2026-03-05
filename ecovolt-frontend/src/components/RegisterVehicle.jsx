import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ ADDED: Accept currentUser as a prop so we know who is registering!
function RegisterVehicle({ currentUser }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehicleType: 'E-RICKSHAW',
        batteryLevel: 100,
        maxRangeKm: 150,
        ratePerKm: 8.0,
        currentLocation: '',
        vehicleNumber: '' // Added this so you can track your specific car
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Get the Token from Local Storage
            const token = localStorage.getItem('jwtToken'); 
            
            // 🌟 2. CRUCIAL: Attach the driver's email and name to the car!
            const vehicleData = {
                ...formData,
                driverEmail: currentUser?.email,
                driverName: currentUser?.name,
                status: 'AVAILABLE'
            };
            
            // 3. Send Data + Token
            await axios.post('http://localhost:8080/api/vehicles', vehicleData, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            alert('✅ Vehicle Registered Successfully! 🚗');
            navigate('/dashboard'); // Go back to the dashboard after success

        } catch (error) {
            console.error(error);
            setMessage('❌ Registration Failed: ' + (error.response?.status === 403 ? "Permission Denied (Check Token)" : "Server Error"));
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '50px auto', backgroundColor: 'white' }}>
            <h3 style={{ textAlign: 'center', color: '#28a745' }}>🚖 Register Your EV</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Vehicle Type</label>
                    <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                        <option value="E-RICKSHAW">E-Rickshaw</option>
                        <option value="E-BIKE">E-Bike</option>
                        <option value="E-CAR">E-Car</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Vehicle Number</label>
                    <input 
                        type="text" 
                        name="vehicleNumber" 
                        placeholder="e.g. MP09 EV 1234"
                        value={formData.vehicleNumber} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Current City</label>
                    {/* ✅ FIXED: Moved this outside of the button! */}
                    <input 
                        type="text" 
                        name="currentLocation"
                        placeholder="e.g. INDORE" 
                        value={formData.currentLocation} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', textTransform: 'uppercase' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Max Range (km)</label>
                    <input 
                        type="number" 
                        name="maxRangeKm" 
                        value={formData.maxRangeKm} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Rate per KM (₹)</label>
                    <input 
                        type="number" 
                        name="ratePerKm" 
                        value={formData.ratePerKm} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <button type="submit" style={{ background: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                    Register Vehicle
                </button>
                
                <button type="button" onClick={() => navigate('/dashboard')} style={{ background: '#f8f9fa', color: '#333', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>
                    Cancel
                </button>
            </form>
            
            {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: 'red', textAlign: 'center' }}>{message}</p>}
        </div>
    );
}

export default RegisterVehicle;