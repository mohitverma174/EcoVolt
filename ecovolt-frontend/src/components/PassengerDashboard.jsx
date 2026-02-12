import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './PassengerDashboard.css'; // We will create this CSS next

function PassengerDashboard({ currentUser }) {
    // State for Booking Form
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        vehicleType: 'E-CAR',
        isCarpool: false
    });

    // State for Ride History
    const [myRides, setMyRides] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Fetch Passenger's Ride History
    const fetchMyRides = useCallback(async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            // Endpoint: /api/rides/user/{email}
            const response = await axios.get(`http://localhost:8080/api/rides/user/${currentUser.email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Sort by newest first
            const sortedRides = response.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
            setMyRides(sortedRides);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    }, [currentUser.email]);

    // Load rides on startup
    useEffect(() => {
        fetchMyRides();
        // Optional: Auto-refresh status every 5 seconds (Real-time feel!)
        const interval = setInterval(fetchMyRides, 5000);
        return () => clearInterval(interval);
    }, [fetchMyRides]);

    // 2. Handle Booking Submission
    // 2. Handle Booking Submission
    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const rideData = { 
                ...formData, 
                passengerEmail: currentUser.email 
            };

            const response = await axios.post('http://localhost:8080/api/rides/book', rideData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log("Booking Response:", response.data);

            // ✅ NEW MESSAGE: clearer for the user
            alert(`📨 Request sent to ${response.data.driverName}! \n\nPlease watch your 'Ride History' below. The status will change to 'ACCEPTED' once the driver confirms.`);
            
            fetchMyRides(); // Refresh list immediately
            setFormData({ ...formData, destination: '' }); // Reset form
        } catch (error) {
            console.error(error);
            alert('Booking Failed. Try again.');
        } 
        setLoading(false);
    };

    return (
        <div className="passenger-container">
            {/* SECTION 1: BOOKING FORM */}
            <div className="booking-card">
                <h2>⚡ Book a Ride</h2>
                <form onSubmit={handleBook}>
                    <div className="form-row">
                        <div className="input-group">
                            <label>📍 Source City</label>
                            <input 
         type="text" 
        placeholder="Enter Source City (e.g., MUMBAI)" 
        value={formData.source} 
        onChange={e => setFormData({...formData, source: e.target.value.toUpperCase()})}
        required
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
    />
    
    <small style={{color:'#666', marginTop:'5px'}}>
        *Must match your Driver's location exactly
    </small>
                        </div>

                        <div className="input-group">
                            <label>🏁 Destination</label>
                            <input 
                                type="text" 
                                placeholder="Enter Destination" 
                                value={formData.destination}
                                onChange={e => setFormData({...formData, destination: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>🚗 Vehicle Type</label>
                            <select 
                                value={formData.vehicleType} 
                                onChange={e => setFormData({...formData, vehicleType: e.target.value})}
                            >
                                <option value="E-CAR">E-Car (4 Seater)</option>
                                <option value="E-BIKE">E-Bike (1 Seater)</option>
                                <option value="E-AUTO">E-Auto (3 Seater)</option>
                            </select>
                        </div>
                        
                        <div className="checkbox-group">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={formData.isCarpool}
                                    onChange={e => setFormData({...formData, isCarpool: e.target.checked})}
                                />
                                👥 Enable Carpool (40% Off)
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="book-btn" disabled={loading}>
                        {loading ? 'Searching Driver...' : '🚀 Book Now'}
                    </button>
                </form>
            </div>

            {/* SECTION 2: LIVE RIDE STATUS */}
            <div className="history-section">
                <h3>📜 Your Ride History</h3>
                <div className="history-list">
                    {myRides.length === 0 ? (
                        <p className="empty-text">No rides yet. Book your first one above!</p>
                    ) : (
                        myRides.map(ride => (
                            <div key={ride.id} className={`history-card ${ride.status.toLowerCase()}`}>
                                <div className="status-badge">{ride.status}</div>
                                <div className="ride-details">
                                    <h4>{ride.source} ➝ {ride.destination}</h4>
                                    <p>🚗 {ride.vehicleType} | {ride.isCarpool ? 'Carpool' : 'Private'}</p>
                                    <p>👮‍♂️ Driver: <strong>{ride.driverName || 'Searching...'}</strong></p>
                                    <p className="fare">₹{ride.price}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default PassengerDashboard;