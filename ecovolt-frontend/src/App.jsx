import Signup from './components/Signup';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import RegisterVehicle from './components/RegisterVehicle';
import DriverDashboard from './components/DriverDashboard';
import PassengerDashboard from './components/PassengerDashboard';
import LandingPage from './components/LandingPage'; 
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Check for existing login on load (WITH FAILSAFE 🛡️)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    // Make sure data exists AND is not the literal string "undefined"
    if (storedUser && storedUser !== 'undefined') {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        // If data is corrupted, wipe it so the app survives
        console.error("Corrupted user data found. Wiping cache.");
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
      }
    } else if (storedUser === 'undefined') {
      // Clean up the bad data silently
      localStorage.removeItem('user');
    }
  }, []);

  // 2. Handle Login Success
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // 3. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          
          {/* 🌿 ROUTE 1: The Public Landing Page (Root) */}
          <Route path="/" element={<LandingPage />} />

          {/* 🔐 ROUTE 2: Login Page */}
          <Route 
            path="/login" 
            element={
              currentUser ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } 
          />

          <Route 
            path="/signup" 
            element={
              currentUser ? <Navigate to="/dashboard" /> : <Signup />
            } 
          />

          {/* 🚗 ROUTE 4: The Protected Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              currentUser ? (
                // If Driver -> Show Driver Dash
                // If Passenger -> Show Passenger Dash
                currentUser.role === 'DRIVER' ? (
                  <DriverDashboard currentUser={currentUser} onLogout={handleLogout} />
                ) : (
                  <PassengerDashboard currentUser={currentUser} onLogout={handleLogout} />
                )
              ) : (
                // If NOT logged in -> Kick to Login
                <Navigate to="/login" />
              )
            } 
          />

          {/* 🚙 ROUTE 5: Vehicle Registration (Protected) */}
          <Route 
            path="/register-vehicle" 
            element={
              currentUser && currentUser.role === 'DRIVER' ? (
                <RegisterVehicle currentUser={currentUser} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;