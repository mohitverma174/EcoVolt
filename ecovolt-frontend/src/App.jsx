import { useState } from 'react';
import BookingForm from './components/BookingForm';
import RegisterVehicle from './components/RegisterVehicle';
import DriverDashboard from './components/DriverDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Stores the logged-in user
  const [authView, setAuthView] = useState('login'); // Toggles between Login/Signup
  const [view, setView] = useState('dashboard'); // Toggles inside the app

  // 1. If User is NOT logged in, show Auth Screens
  if (!user) {
    return (
      <div className="app-container">
        <h1 style={{ textAlign: 'center', color: '#28a745' }}>EcoVolt ⚡</h1>
        {authView === 'login' ? (
          <Login onLoginSuccess={setUser} onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // 2. If User IS logged in, show the Main App
  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <h1 style={{ color: '#28a745' }}>EcoVolt ⚡</h1>
        <div>
            <span>Welcome, <strong>{user.name}</strong> ({user.role}) </span>
            <button onClick={() => setUser(null)} style={{ marginLeft: '10px', background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Navigation Buttons based on Role */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        
        {/* PASSENGERS see Booking */}
        {user.role === 'PASSENGER' && (
             <button onClick={() => setView('booking')} disabled={view === 'booking'}>
                👤 Book a Ride
             </button>
        )}

        {/* DRIVERS see Dashboard & Register */}
        {user.role === 'DRIVER' && (
            <>
                <button onClick={() => setView('dashboard')} disabled={view === 'dashboard'}>
                    🚖 My Dashboard
                </button>
                <button onClick={() => setView('register')} disabled={view === 'register'}>
                    ➕ Register Vehicle
                </button>
            </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="content-area">
        {user.role === 'PASSENGER' && <BookingForm currentUser={user} />}
        {user.role === 'DRIVER' && view === 'dashboard' && <DriverDashboard currentUser={user} />}
        {user.role === 'DRIVER' && view === 'register' && <RegisterVehicle />}
      </div>
    </div>
  );
}

export default App;