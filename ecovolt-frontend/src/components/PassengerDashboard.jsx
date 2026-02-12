import { useState, useEffect } from 'react';
import axios from 'axios';
import './PassengerDashboard.css';

function PassengerDashboard({ currentUser }) {
    const [rides, setRides] = useState([]);
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        vehicleType: 'E-CAR'
    });
    
    const [allCities, setAllCities] = useState([]); 
    const [filteredCities, setFilteredCities] = useState([]); 
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. ROBUST FETCH: Handles page refreshes automatically
    useEffect(() => {
        // 1. Auto-Fetch Rides (Handle page refresh)
        let savedEmail = currentUser?.email;
        if (!savedEmail) {
            const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
            savedEmail = savedUser.email;
        }
        if (savedEmail) fetchMyRides(savedEmail);

        // 2. Fetch Cities
        axios.get('http://localhost:8080/api/vehicles/locations')
            .then(res => {
                if(res.data) {
                    const cleanCities = res.data.filter(c => c).map(c => c.toUpperCase());
                    setAllCities([...new Set(cleanCities)]); 
                }
            })
            .catch(err => console.error("Error fetching cities", err));
    }, [currentUser]);
    // 2. UPDATED FETCH FUNCTION: Accepts an email argument
    // ✅ FIXED: Safely handles button clicks and manual calls
    const fetchMyRides = async (emailOverride) => {
        let email = currentUser?.email;

        // 1. If an email string is passed, use it.
        // 2. If it's a "Click Event" (object), IGNORE it and use state email.
        if (typeof emailOverride === 'string') {
            email = emailOverride;
        } else if (!email) {
            // Fallback: Check local storage if state is empty
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            email = stored.email;
        }

        if (!email) {
            console.warn("⚠️ No email found to fetch rides.");
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/rides/passenger/${email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Sort: Newest first
            setRides(response.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime)));
        } catch (error) {
            console.error("❌ Error fetching rides:", error);
        }
    };

    // 💰 NEW: Handle Payment Click
    const handlePayment = async (rideId, amount) => {
        // 1. Confirm with user
        if (!window.confirm(`💳 Securely Pay ₹${amount} for this ride?`)) return;

        try {
            const token = localStorage.getItem('jwtToken');
            
            // 2. Call Backend API
            // Note: Ensure RideController has the @PutMapping("/{id}/pay") method!
            await axios.put(`http://localhost:8080/api/rides/${rideId}/pay`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert("✅ Payment Successful! Thank you for using EcoVolt.");
            fetchMyRides(); // Refresh to show 'PAID' status

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment Failed. Please try again.");
        }
    };

    // Search Box Logic
    const handleSourceChange = (e) => {
        const input = e.target.value.toUpperCase();
        setFormData({ ...formData, source: input });
        
        if (input.length > 0) {
            const matches = allCities.filter(city => city.includes(input));
            setFilteredCities(matches);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectCity = (city) => {
        setFormData({ ...formData, source: city });
        setShowSuggestions(false); 
    };

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (allCities.length > 0 && !allCities.includes(formData.source)) {
            if(!window.confirm(`⚠️ We don't have cars in "${formData.source}" yet. Continue?`)) {
                setLoading(false);
                return;
            }
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const rideData = { ...formData, passengerEmail: currentUser.email };
            
            const response = await axios.post('http://localhost:8080/api/rides/book', rideData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert(`📨 Request sent to ${response.data.driverName}!`);
            fetchMyRides(); 
            setFormData({ ...formData, destination: '' }); 
        } catch (error) {
            alert('Booking Failed. Try again.');
        } 
        setLoading(false);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>🚖 Passenger Console</h1>
                    <span className="user-badge">👤 {currentUser?.name || "Passenger"}</span>
                </div>
            </header>

            <div className="booking-card">
                <h2>Book a New Ride</h2>
                <form onSubmit={handleBook}>
                    <div className="input-group" style={{position: 'relative'}}>
                        <label>📍 Source City</label>
                        <input 
                            type="text" 
                            placeholder="Type to search (e.g. INDORE)" 
                            value={formData.source} 
                            onChange={handleSourceChange}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            required
                            autoComplete="off"
                        />
                        {showSuggestions && filteredCities.length > 0 && (
                            <ul className="suggestions-list">
                                {filteredCities.map(city => (
                                    <li key={city} onClick={() => selectCity(city)}>🏢 {city}</li>
                                ))}
                            </ul>
                        )}
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

                    <div className="input-group">
                        <label>🚗 Vehicle Type</label>
                        <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})}>
                            <option value="E-CAR">E-Car (4 Seater)</option>
                            <option value="E-BIKE">E-Bike (1 Seater)</option>
                            <option value="E-RICKSHAW">E-Rickshaw (Shared)</option>
                        </select>
                    </div>

                    <button type="submit" className="book-btn" disabled={loading}>
                        {loading ? "Booking..." : "🚀 Request Ride"}
                    </button>
                </form>
            </div>

            <div className="ride-history">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h3>📜 Your Ride History</h3>
                    <button onClick={fetchMyRides} className="refresh-btn">🔄 Refresh</button>
                </div>
                
                <div className="history-list">
                    {rides.length === 0 ? <p>No rides yet.</p> : rides.map(ride => (
                        <div key={ride.id} className="history-item">
                            <div className="history-details">
                                <span className="route">{ride.source} ➝ {ride.destination}</span>
                                <span className="date">{new Date(ride.bookingTime).toLocaleString()}</span>
                                <span className="driver-info">Driver: {ride.driverName}</span>
                            </div>
                            
                            {/* 🌟 ACTION AREA: Shows Status OR Payment Button */}
                            <div className="action-right">
                                {ride.status === 'COMPLETED' ? (
                                    <button 
                                        className="pay-btn" 
                                        onClick={() => handlePayment(ride.id, ride.price)}
                                    >
                                        💳 Pay ₹{ride.price}
                                    </button>
                                ) : (
                                    <span className={`status-badge ${ride.status.toLowerCase()}`}>
                                        {ride.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PassengerDashboard;