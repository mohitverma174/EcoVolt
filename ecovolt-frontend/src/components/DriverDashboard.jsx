import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DriverDashboard.css'; 

function DriverDashboard({ currentUser }) {
    const [rides, setRides] = useState([]);
    const [driverName, setDriverName] = useState('');
    const [driverEmail, setDriverEmail] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        let user = currentUser;
        
        if (!user) {
            const userStr = localStorage.getItem('user');
            if (userStr) user = JSON.parse(userStr);
        }

        if (!user || user.role !== 'DRIVER') {
            alert("⚠️ Access Denied: Drivers Only.");
            navigate('/login');
            return;
        }

        setDriverName(user.name || "Driver");
        setDriverEmail(user.email); 
        
        if (user.email) {
            fetchRides(user.email);
        }
    }, [currentUser, navigate]);

    const fetchRides = async (email) => {
        try {
            console.log("Fetching rides for:", email); 
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/rides/driver/${email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Sort rides: Newest first!
            const sortedRides = response.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
            setRides(sortedRides);
        } catch (error) {
            console.error("Error loading rides:", error);
        }
    };

    const updateStatus = async (rideId, newStatus) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`http://localhost:8080/api/rides/${rideId}/status?status=${newStatus}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchRides(driverEmail); 
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>🚖 Driver Console</h1>
                    <span className="online-badge">● Online as: {driverEmail}</span>
                </div>
                <div className="driver-info">
                    {/* ✅ GLOBAL REFRESH BUTTON (Always Visible) */}
                    <button 
                        onClick={() => fetchRides(driverEmail)} 
                        style={{marginRight: '15px', background:'#17a2b8', color:'white', border:'none', padding:'8px 12px', borderRadius:'5px', cursor:'pointer'}}
                    >
                        🔄 Refresh List
                    </button>
                    <span>👋 {driverName}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            <div className="stats-bar">
                <div className="stat-box">
                    <h3>{rides.length}</h3>
                    <p>Total Rides</p>
                </div>
                <div className="stat-box">
                    <h3>₹{rides.reduce((acc, ride) => acc + (ride.status === 'COMPLETED' ? ride.price : 0), 0)}</h3>
                    <p>Total Earnings</p>
                </div>
            </div>

            <div className="rides-grid">
                {rides.length === 0 ? (
                    <div className="no-rides">
                        <h3>No rides assigned yet 💤</h3>
                        <p>Waiting for new requests...</p>
                    </div>
                ) : (
                    rides.map(ride => (
                        <div key={ride.id} className={`ride-card ${ride.status.toLowerCase()}`}>
                            <div className="card-header">
                                <span className="badge">{ride.vehicleType}</span>
                                <span className="price">₹{ride.price}</span>
                            </div>
                            
                            <div className="route-info">
                                <div className="location">
                                    <span className="dot source">🟢</span>
                                    <strong>{ride.source}</strong>
                                </div>
                                <div className="location">
                                    <span className="dot dest">🔴</span>
                                    <strong>{ride.destination}</strong>
                                </div>
                            </div>

                            <div className="passenger-details">
                                <p>👤 {ride.passengerEmail}</p>
                                <p>🕒 {new Date(ride.bookingTime).toLocaleString()}</p>
                            </div>

                            <div className="action-area">
                                <p className="status-label">Status: <strong>{ride.status}</strong></p>
                                
                                {ride.status === 'BOOKED' && (
                                    <button className="btn-accept" onClick={() => updateStatus(ride.id, 'ACCEPTED')}>
                                        ✅ Accept Ride
                                    </button>
                                )}
                                {ride.status === 'ACCEPTED' && (
                                    <button className="btn-start" onClick={() => updateStatus(ride.id, 'ONGOING')}>
                                        ▶️ Start Trip
                                    </button>
                                )}
                                {ride.status === 'ONGOING' && (
                                    <button className="btn-complete" onClick={() => updateStatus(ride.id, 'COMPLETED')}>
                                        🏁 Complete Ride
                                    </button>
                                )}
                                {ride.status === 'COMPLETED' && (
                                    <button className="btn-done" disabled>Ride Finished</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DriverDashboard;