import { useState } from 'react';
import axios from 'axios';

function DriverDashboard() {
    const [vehicleId, setVehicleId] = useState('');
    const [myRides, setMyRides] = useState([]);

    // 1. Fetch rides assigned to this Vehicle ID (NOW SECURE)
    const fetchMyRides = async () => {
        try {
            // Get the token
            const token = localStorage.getItem('jwtToken');

            // Send Token in Header
            const response = await axios.get(`http://localhost:8080/api/rides/driver/${vehicleId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMyRides(response.data);
        } catch (error) {
            console.error(error);
            alert("Error fetching rides (Check Vehicle ID or Login)");
        }
    };

    // 2. Mark a ride as COMPLETED (NOW SECURE)
    const completeRide = async (rideId) => {
        try {
            const token = localStorage.getItem('jwtToken');

            await axios.put(`http://localhost:8080/api/rides/complete/${rideId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("Ride Completed! ✅");
            fetchMyRides(); // Refresh list
        } catch (error) {
            console.error(error);
            alert("Error updating ride");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>🚖 Driver Dashboard</h2>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    placeholder="Enter Your Vehicle ID" 
                    value={vehicleId} 
                    onChange={(e) => setVehicleId(e.target.value)}
                    style={{ padding: '8px', flex: 1 }}
                />
                <button onClick={fetchMyRides} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px' }}>
                    Load My Rides
                </button>
            </div>

            {myRides.length === 0 ? <p>No rides assigned yet.</p> : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {myRides.map(ride => (
                        <li key={ride.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                            <p><strong>Passenger:</strong> {ride.userName}</p>
                            <p><strong>Route:</strong> {ride.source} ➝ {ride.destination}</p>
                            <p><strong>Fare:</strong> ₹{ride.price ? ride.price.toFixed(2) : '0.00'}</p>
                            <p><strong>Status:</strong> 
                                <span style={{ color: ride.status === 'COMPLETED' ? 'green' : 'orange', fontWeight: 'bold', marginLeft: '5px' }}>
                                    {ride.status}
                                </span>
                            </p>
                            
                            {ride.status !== 'COMPLETED' && (
                                <button 
                                    onClick={() => completeRide(ride.id)}
                                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    ✅ Mark Complete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DriverDashboard;