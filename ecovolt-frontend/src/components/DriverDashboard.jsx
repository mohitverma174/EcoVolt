import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DriverDashboard({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const [myVehicle, setMyVehicle] = useState(null);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🌟 NEW: Dynamic Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // 🌟 Helper function to trigger beautiful notifications
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500); 
    };

    useEffect(() => {
        const fetchDriverData = async () => {
            const email = currentUser?.email || JSON.parse(localStorage.getItem('user') || '{}').email;
            if (!email) return;

            try {
                const token = localStorage.getItem('jwtToken');
                const headers = { 'Authorization': `Bearer ${token}` };
                
                try {
                    const vehicleRes = await axios.get(`http://localhost:8080/api/vehicles/driver/${email}`, { headers });
                    setMyVehicle(vehicleRes.data);
                } catch (err) {
                    console.log("No vehicle found.");
                }

                try {
                    const ridesRes = await axios.get(`http://localhost:8080/api/rides/driver/${email}`, { headers });
                    setRides(ridesRes.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime)));
                } catch (err) {
                    console.log("No rides found.");
                }

            } catch (error) {
                console.error("Dashboard Error", error);
            }
            setLoading(false);
        };

        fetchDriverData();
    }, [currentUser]);

    const handleCompleteRide = async (rideId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`http://localhost:8080/api/rides/${rideId}/complete`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // 🌟 Replaced window.alert with smooth Toast!
            showToast("Trip Finished! Passenger will be notified to pay.", 'success');
            
            const email = currentUser?.email || JSON.parse(localStorage.getItem('user') || '{}').email;
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const ridesRes = await axios.get(`http://localhost:8080/api/rides/driver/${email}`, { headers });
            setRides(ridesRes.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime)));

            const vehicleRes = await axios.get(`http://localhost:8080/api/vehicles/driver/${email}`, { headers });
            setMyVehicle(vehicleRes.data);

        } catch (error) {
            // 🌟 Replaced window.alert with error Toast!
            showToast("Failed to complete the ride.", 'error');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px', color: '#555' }}>Loading Driver Console... 🚙</div>;

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px', position: 'relative' }}>
            
            {/* 🌟 DYNAMIC TOAST NOTIFICATION */}
            {toast.show && (
                <div style={{
                    position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
                    background: toast.type === 'error' ? '#ff4757' : '#2ed573',
                    color: 'white', padding: '15px 30px', borderRadius: '30px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)', zIndex: 9999,
                    fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.3s ease-in-out'
                }}>
                    {toast.type === 'error' ? '❌' : '✅'} {toast.message}
                </div>
            )}

            <nav style={{ background: '#1e272e', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0fb9b1' }}>⚡ EcoVolt Driver</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontWeight: '500', color: '#d2dae2' }}>👨‍✈️ {currentUser?.name?.split(' ')[0] || "Captain"}</span>
                    <button 
                        onClick={() => { if(onLogout) onLogout(); navigate('/'); }} 
                        style={{ background: '#ff3f34', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
                    >
                        Log Out
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
                
                {!myVehicle ? (
                    <div style={{ background: 'white', borderRadius: '15px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: '5px solid #ff3f34' }}>
                        <div style={{ fontSize: '50px', marginBottom: '15px' }}>🚫</div>
                        <h2 style={{ color: '#1e272e', marginBottom: '10px' }}>No Vehicle Registered</h2>
                        <p style={{ color: '#576574', marginBottom: '25px', fontSize: '16px' }}>
                            You cannot receive ride requests until you add your EV to the EcoVolt network.
                        </p>
                        <button 
                            onClick={() => navigate('/register-vehicle')} 
                            style={{ background: '#0fb9b1', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(15, 185, 177, 0.4)' }}
                        >
                            ➕ Register My EV Now
                        </button>
                    </div>
                ) : (
                    <div style={{ background: 'white', borderRadius: '15px', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderLeft: `8px solid ${myVehicle.status === 'AVAILABLE' ? '#0fb9b1' : '#f39c12'}` }}>
                        <div>
                            <h2 style={{ margin: '0 0 5px 0', color: '#1e272e' }}>{myVehicle.vehicleType} <span style={{ color: '#808e9b', fontSize: '16px' }}>({myVehicle.vehicleNumber})</span></h2>
                            <p style={{ margin: 0, color: '#576574', fontSize: '15px' }}>📍 City: <strong>{myVehicle.currentLocation}</strong></p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                                background: myVehicle.status === 'AVAILABLE' ? '#e0f7fa' : '#fff3e0', 
                                color: myVehicle.status === 'AVAILABLE' ? '#00838f' : '#e65100',
                                padding: '10px 20px', 
                                borderRadius: '30px', 
                                fontWeight: '900',
                                fontSize: '16px',
                                display: 'inline-block',
                                border: `1px solid ${myVehicle.status === 'AVAILABLE' ? '#b2ebf2' : '#ffe0b2'}`
                            }}>
                                {myVehicle.status === 'AVAILABLE' ? '🟢 AVAILABLE' : '🔴 BUSY'}
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: '#1e272e', margin: 0 }}>📋 Live Ride Requests</h3>
                        <button onClick={() => window.location.reload()} style={{ background: 'white', border: '1px solid #d2dae2', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', color: '#576574', fontWeight: 'bold' }}>
                            🔄 Refresh
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {rides.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '15px', color: '#808e9b' }}>
                                ☕ No active rides right now. Stay online!
                            </div>
                        ) : rides.map(ride => (
                            <div key={ride.id} style={{ background: 'white', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                <div>
                                    <div style={{ fontWeight: '900', fontSize: '20px', color: '#1e272e', marginBottom: '5px' }}>
                                        {ride.source} <span style={{ color: '#0fb9b1' }}>➝</span> {ride.destination}
                                    </div>
                                    <div style={{ color: '#576574', fontSize: '14px', marginBottom: '5px' }}>🕒 {new Date(ride.bookingTime).toLocaleString()}</div>
                                    <div style={{ color: '#34495e', fontSize: '15px', fontWeight: '500' }}>👤 Passenger: {ride.passengerEmail}</div>
                                </div>
                                
                                <div>
                                    {ride.status === 'ACCEPTED' ? (
                                        <button 
                                            onClick={() => handleCompleteRide(ride.id)}
                                            style={{ background: '#0fb9b1', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(15, 185, 177, 0.3)' }}
                                        >
                                            ✅ Finish Trip
                                        </button>
                                    ) : (
                                        <span style={{ 
                                            background: ride.status === 'COMPLETED' ? '#d4edda' : (ride.status === 'PAID' ? '#cce5ff' : '#f8f9fa'), 
                                            color: ride.status === 'COMPLETED' ? '#155724' : (ride.status === 'PAID' ? '#004085' : '#6c757d'), 
                                            padding: '8px 15px', 
                                            borderRadius: '20px', 
                                            fontWeight: 'bold' 
                                        }}>
                                            {ride.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DriverDashboard;