import { useState, useEffect } from 'react';
import axios from 'axios';
import './PassengerDashboard.css';

function PassengerDashboard({ currentUser, onLogout }) {
    const [rides, setRides] = useState([]);
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        vehicleType: 'E-CAR',
        isCarpool: false
    });
    
    const [allCities, setAllCities] = useState([]); 
    const [filteredCities, setFilteredCities] = useState([]); 
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const [paymentModal, setPaymentModal] = useState({ show: false, rideId: null, amount: 0, method: 'UPI' });
    
    // Dynamic Custom UI States
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [confirmModal, setConfirmModal] = useState({ show: false, message: '', action: null });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500); 
    };

    useEffect(() => {
        let savedEmail = currentUser?.email || JSON.parse(localStorage.getItem('user') || '{}').email;
        if (savedEmail) fetchMyRides(savedEmail);

        axios.get('http://localhost:8080/api/vehicles/locations')
            .then(res => {
                if(res.data) setAllCities([...new Set(res.data.filter(c => c).map(c => c.toUpperCase()))]); 
            })
            .catch(err => console.error("Error fetching cities", err));
    }, [currentUser]);

    const fetchMyRides = async (emailOverride) => {
        let email = typeof emailOverride === 'string' ? emailOverride : currentUser?.email || JSON.parse(localStorage.getItem('user') || '{}').email;
        if (!email) return;

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/rides/passenger/${email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRides(response.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime)));
        } catch (error) {
            console.error("Error fetching rides:", error);
        }
    };

    const openPaymentModal = (rideId, amount) => {
        setPaymentModal({ show: true, rideId, amount: amount || 150, method: 'UPI' });
    };

    const processPayment = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`http://localhost:8080/api/rides/${paymentModal.rideId}/pay`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            showToast(`₹${paymentModal.amount} paid successfully via ${paymentModal.method}!`, 'success');
            setPaymentModal({ show: false, rideId: null, amount: 0, method: 'UPI' }); 
            fetchMyRides(); 
        } catch (error) {
            showToast("Payment Failed. Please try again.", 'error');
        }
    };

    const handleSourceChange = (e) => {
        const input = e.target.value.toUpperCase();
        setFormData({ ...formData, source: input });
        if (input.length > 0) {
            setFilteredCities(allCities.filter(city => city.includes(input)));
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const executeBooking = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const finalVehicleType = formData.isCarpool ? `${formData.vehicleType}-POOL` : formData.vehicleType;
            const rideData = { ...formData, vehicleType: finalVehicleType, passengerEmail: currentUser.email };
            
            const response = await axios.post('http://localhost:8080/api/rides/book', rideData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const assignedDriver = response.data.driverName || response.data.driverEmail || "an EcoVolt Driver";
            showToast(`Ride Booked! Matched with ${assignedDriver}.`, 'success');
            
            fetchMyRides(); 
            setFormData({ ...formData, destination: '', isCarpool: false }); 
        } catch (error) {
            showToast('Booking Failed. No vehicles available in that area.', 'error');
        } 
        setLoading(false);
    };

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (allCities.length > 0 && !allCities.includes(formData.source)) {
            setConfirmModal({
                show: true,
                message: `⚠️ We don't have registered cars in "${formData.source}" yet. Do you still want to search?`,
                action: () => {
                    setConfirmModal({ show: false, message: '', action: null });
                    executeBooking();
                }
            });
            return;
        }

        executeBooking();
    };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px', position: 'relative' }}>
            
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

            {confirmModal.show && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ margin: '0 0 15px 0', color: '#ff9f43' }}>Wait a second!</h2>
                        <p style={{ color: '#555', marginBottom: '25px', fontSize: '16px', lineHeight: '1.5' }}>{confirmModal.message}</p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button onClick={() => setConfirmModal({ show: false })} style={{ flex: 1, padding: '12px', background: '#f1f2f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#57606f' }}>Cancel</button>
                            <button onClick={confirmModal.action} style={{ flex: 1, padding: '12px', background: '#2ed573', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>Search Anyway</button>
                        </div>
                    </div>
                </div>
            )}

            <nav style={{ background: 'white', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>🌱 EcoVolt</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontWeight: '500', color: '#555' }}>👤 Hello, {currentUser?.name?.split(' ')[0] || "Passenger"}</span>
                    <button onClick={onLogout} style={{ background: '#ff4757', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Log Out</button>
                </div>
            </nav>

            <div className="dashboard-container" style={{ marginTop: '30px' }}>
                <div className="booking-card" style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderTop: '5px solid #28a745' }}>
                    <h2 style={{ marginBottom: '20px', color: '#333' }}>Where to?</h2>
                    <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="input-group" style={{ flex: 1, position: 'relative' }}>
                                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>📍 Pickup Location</label>
                                <input type="text" placeholder="Enter City" value={formData.source} onChange={handleSourceChange} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} required autoComplete="off" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }} />
                                {showSuggestions && filteredCities.length > 0 && (
                                    <ul className="suggestions-list" style={{ position: 'absolute', background: 'white', width: '100%', border: '1px solid #ddd', borderRadius: '5px', listStyle: 'none', padding: 0, margin: 0, zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                        {filteredCities.map(city => (<li key={city} onClick={() => { setFormData({ ...formData, source: city }); setShowSuggestions(false); }} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>🏢 {city}</li>))}
                                    </ul>
                                )}
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>🏁 Dropoff</label>
                                <input type="text" placeholder="Enter Destination" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>🚗 Choose Vehicle</label>
                            <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px', backgroundColor: '#f8f9fa' }}>
                                <option value="E-CAR">E-Car (Premium, 4 Seats)</option>
                                <option value="E-BIKE">E-Bike (Fast, 1 Seat)</option>
                                <option value="E-RICKSHAW">E-Rickshaw (Economy)</option>
                            </select>
                        </div>

                        <div style={{ background: '#eef7f0', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #c3e6cb' }}>
                            <input type="checkbox" id="carpool" checked={formData.isCarpool} onChange={(e) => setFormData({...formData, isCarpool: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                            <label htmlFor="carpool" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 'bold', color: '#155724' }}>🤝 Pool this ride (Carpool)</span>
                                <span style={{ fontSize: '12px', color: '#3d8b40' }}>Share your ride with others to save up to 40% on your fare.</span>
                            </label>
                        </div>

                        <button type="submit" disabled={loading} style={{ background: '#28a745', color: 'white', padding: '15px', borderRadius: '8px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                            {loading ? "Searching for EVs..." : "Confirm Booking"}
                        </button>
                    </form>
                </div>

                <div className="ride-history" style={{ marginTop: '40px' }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
                        <h3 style={{ color: '#333' }}>📜 Recent Trips</h3>
                        <button onClick={fetchMyRides} style={{ background: 'transparent', border: '1px solid #ccc', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>🔄 Refresh</button>
                    </div>
                    
                    <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {rides.length === 0 ? <p style={{ color: '#777' }}>No trips yet. Book your first ride above!</p> : rides.map(ride => (
                            <div key={ride.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{ride.source} ➝ {ride.destination}</div>
                                    <div style={{ color: '#777', fontSize: '14px', margin: '5px 0' }}>📅 {new Date(ride.bookingTime).toLocaleString()}</div>
                                    <div style={{ color: '#555', fontSize: '14px' }}>🚘 Vehicle: {ride.vehicleType} | Driver: {ride.driverName || 'Assigned'}</div>
                                </div>
                                
                                <div>
                                    {ride.status === 'COMPLETED' ? (
                                        <button onClick={() => openPaymentModal(ride.id, ride.price)} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>💳 Pay ₹{ride.price || '150'}</button>
                                    ) : (
                                        <span style={{ background: ride.status === 'PAID' ? '#d4edda' : '#fff3cd', color: ride.status === 'PAID' ? '#155724' : '#856404', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>{ride.status}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {paymentModal.show && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '400px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                        <div style={{ background: '#28a745', color: 'white', padding: '20px', textAlign: 'center' }}><h2 style={{ margin: 0 }}>Complete Payment</h2></div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                                <p style={{ margin: 0, color: '#666' }}>Amount Due</p>
                                <h1 style={{ margin: '5px 0', color: '#333', fontSize: '40px' }}>₹{paymentModal.amount}</h1>
                            </div>
                            <label style={{ fontWeight: 'bold', color: '#555', marginBottom: '10px', display: 'block' }}>Select Payment Method:</label>
                            <select value={paymentModal.method} onChange={(e) => setPaymentModal({...paymentModal, method: e.target.value})} style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '25px' }}>
                                <option value="UPI">📱 UPI (GPay, PhonePe, Paytm)</option>
                                <option value="Credit/Debit Card">💳 Credit / Debit Card</option>
                                <option value="Cash">💵 Cash to Driver</option>
                            </select>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setPaymentModal({ show: false })} style={{ flex: 1, padding: '12px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#555' }}>Cancel</button>
                                <button onClick={processPayment} style={{ flex: 2, padding: '12px', background: '#28a745', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>Confirm & Pay</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PassengerDashboard;