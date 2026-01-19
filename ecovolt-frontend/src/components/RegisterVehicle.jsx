import { useState } from 'react';
import axios from 'axios';

function RegisterVehicle() {
    const [formData, setFormData] = useState({
        vehicleType: 'E-RICKSHAW',
        batteryLevel: 100,
        maxRangeKm: 150,
        ratePerKm: 8.0
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // CALLS THE DYNAMIC API (No more hardcoding!)
            await axios.post('http://localhost:8080/api/vehicles', formData);
            setMessage('✅ Vehicle Registered Successfully! It is now available for booking.');
        } catch (error) {
            setMessage('❌ Error registering vehicle.');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
            <h3>🚖 Driver: Register Your Vehicle</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                <label>Vehicle Type</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} style={{ padding: '8px' }}>
                    <option value="E-RICKSHAW">E-Rickshaw</option>
                    <option value="E-BIKE">E-Bike</option>
                    <option value="E-CAR">E-Car</option>
                </select>

                <label>Max Range (km)</label>
                <input 
                    type="number" 
                    name="maxRangeKm" 
                    value={formData.maxRangeKm} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px' }}
                />

                <label>Rate per KM (₹)</label>
                <input 
                    type="number" 
                    name="ratePerKm" 
                    value={formData.ratePerKm} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '8px' }}
                />

                <button type="submit" style={{ background: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Register Vehicle
                </button>
            </form>
            {message && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{message}</p>}
        </div>
    );
}

export default RegisterVehicle;