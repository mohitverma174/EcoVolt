import { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingForm.css'; // Ensure you have the CSS we added earlier

function BookingForm({ currentUser }) {
  const [formData, setFormData] = useState({
    userName: '',
    source: '',
    destination: '',
    vehicleType: 'E-Rickshaw',
    distance: '' // Kept for compatibility, even if calculated on backend
  });

  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Controls the animation

  // 1. Auto-fill Name when component loads
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        userName: currentUser.name
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // 1. START ANIMATION
    setIsSearching(true);

    // 2. WAIT 3 SECONDS (The Delay)
    setTimeout(async () => {
        try {
            const token = localStorage.getItem('jwtToken');

            // 3. SEND REQUEST (After delay)
            const response = await axios.post('http://localhost:8080/api/rides/book', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // 4. SUCCESS: Show Driver & Vehicle Details
            const { driverName, vehicleId, price } = response.data;
            setMessage(`✅ Ride Booked! Driver: ${driverName || 'Assigned'} | Vehicle ID: ${vehicleId} | Fare: ₹${price}`);
            
        } catch (error) {
            console.error(error);
            setMessage('❌ Booking failed: ' + (error.response?.data || "Server Error"));
        } finally {
            // 5. STOP ANIMATION
            setIsSearching(false);
        }
    }, 3000); // 3000ms = 3 seconds
  };

  // --- RENDERING ---

  // A. IF SEARCHING: Show Radar Animation
  if (isSearching) {
      return (
          <div className="booking-container">
            <div className="form-card" style={{ textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="searching-container">
                    <div className="radar-pulse"></div>
                    <p className="searching-text">📡 Contacting nearby drivers...</p>
                </div>
            </div>
          </div>
      );
  }

  // B. NORMAL STATE: Show Form
  return (
    <div className="booking-container">
      <div className="form-card">
        <h3>Book a Green Ride 🚖</h3>
        
        {/* Show Success/Error Message Here */}
        {message && (
            <div className={`message ${message.includes('failed') ? 'error' : 'success'}`} style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', backgroundColor: message.includes('failed') ? '#f8d7da' : '#d4edda', color: message.includes('failed') ? '#721c24' : '#155724' }}>
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Read-Only Name Field */}
          <div className="form-group">
            <label>Passenger</label>
            <input 
                type="text" 
                name="userName" 
                value={formData.userName} 
                readOnly 
                style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed', color: '#666' }}
            />
          </div>
          
          <div className="row">
            <input type="text" name="source" placeholder="Source (e.g. Indore)" onChange={handleChange} required />
            <input type="text" name="destination" placeholder="Destination (e.g. Ujjain)" onChange={handleChange} required />
          </div>

          <div className="row">
            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
              <option value="E-Rickshaw">E-Rickshaw</option>
              <option value="E-Bike">E-Bike</option>
              <option value="E-Car">E-Car</option>
            </select>
          </div>

          <button type="submit" className="book-btn">Find Driver</button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;