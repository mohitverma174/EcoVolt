import { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios';
import './BookingForm.css';

// 1. Accept 'currentUser' as a prop
function BookingForm({ currentUser }) {
  const [formData, setFormData] = useState({
    userName: '',
    source: '',
    destination: '',
    vehicleType: 'E-Rickshaw',
    distance: ''
  });

  const [message, setMessage] = useState('');
  const [rides, setRides] = useState([]);

  // 2. Auto-fill Name when component loads
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        userName: currentUser.name // Uses the logged-in user's name automatically
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 // ... inside BookingForm.jsx ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // 1. Retrieve the token from storage
      const token = localStorage.getItem('jwtToken');

      // 2. Send the Booking Request WITH the Token in the Header
      await axios.post('http://localhost:8080/api/rides/book', formData, {
        headers: {
            'Authorization': `Bearer ${token}` // This is the Key!
        }
      });

      setMessage('✅ Booking Successful! Finding your driver...');
      fetchRides(); 
    } catch (error) {
      // ... error handling stays the same
      setMessage('❌ Booking failed: ' + (error.response?.data || "Server Error"));
    }
  };

  const fetchRides = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/rides/all');
      setRides(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <div className="booking-container">
      <div className="form-card">
        <h3>Book a Green Ride 🚖</h3>
        
        <form onSubmit={handleSubmit}>
          {/* 3. Make Name Read-Only so they know it's auto-filled */}
          <input 
            type="text" 
            name="userName" 
            value={formData.userName} 
            readOnly 
            placeholder="Passenger Name" 
            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
          />
          
          <div className="row">
            <input type="text" name="source" placeholder="Source (e.g., Home)" onChange={handleChange} required />
            <input type="text" name="destination" placeholder="Destination (e.g., Office)" onChange={handleChange} required />
          </div>

          <div className="row">
            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
              <option value="E-Rickshaw">E-Rickshaw</option>
              <option value="E-Bike">E-Bike</option>
              <option value="E-Car">E-Car</option>
            </select>
            
          </div>

          <button type="submit" className="book-btn">Book Now</button>
        </form>

        {message && <p className={`message ${message.includes('failed') ? 'error' : 'success'}`}>{message}</p>}
      </div>
    </div>
  );
}

export default BookingForm;