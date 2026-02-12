import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PassengerDashboard from './components/PassengerDashboard';
// import BookingForm from './components/BookingForm';
import RegisterVehicle from './components/RegisterVehicle'; // Ensure this file exists or comment it out
import DriverDashboard from './components/DriverDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  // 👇 2. Initialize State from LocalStorage (So refresh doesn't log you out!)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authView, setAuthView] = useState('login'); 
  const [view, setView] = useState('dashboard'); 

  // 3. Helper to handle logout properly
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setUser(null);
  };

  // 4. If User is NOT logged in, show Auth Screens
  if (!user) {
    return (
      <Router> {/* ✅ Wrapped in Router to prevent crashes */}
        <div className="app-container">
          <h1 style={{ textAlign: 'center', color: '#28a745', marginBottom: '20px' }}>EcoVolt ⚡</h1>
          
          {authView === 'login' ? (
            <Login 
                onLoginSuccess={setUser} 
                onSwitchToSignup={() => setAuthView('signup')} 
            />
          ) : (
            <Signup onSwitchToLogin={() => setAuthView('login')} />
          )}
        </div>
      </Router>
    );
  }

  // 5. If User IS logged in, show the Navbar + Main App
  return (
    <Router> {/* ✅ Wrapped in Router */}
      <div className="app-container">
        
        {/* Pass user and logout handler to Navbar */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Main Content Area */}
        <div className="content-area" style={{ marginTop: '20px' }}>
          
          {/* PASSENGER VIEW */}
          {user.role === 'PASSENGER' && (
              <PassengerDashboard currentUser={user} /> 
          )}

          {/* DRIVER VIEW */}
          {user.role === 'DRIVER' && (
              <>
                  {/* Toggle Buttons for Driver */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                      <button 
                        onClick={() => setView('dashboard')} 
                        style={{ padding: '8px 16px', background: view === 'dashboard' ? '#28a745' : '#ccc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                          Dashboard
                      </button>
                      <button 
                        onClick={() => setView('register')} 
                        style={{ padding: '8px 16px', background: view === 'register' ? '#28a745' : '#ccc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                          Register Vehicle
                      </button>
                  </div>

                  {view === 'dashboard' ? (
                      <DriverDashboard /> 
                  ) : (
                      // Only render if you have created this component, otherwise it might error
                      <RegisterVehicle /> 
                  )}
              </>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;