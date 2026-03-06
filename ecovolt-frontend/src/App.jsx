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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser && storedUser !== 'undefined') {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Corrupted user data found. Wiping cache.");
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
      }
    } else if (storedUser === 'undefined') {
      localStorage.removeItem('user');
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<LandingPage />} />

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

          <Route 
            path="/dashboard" 
            element={
              currentUser ? (
                currentUser.role === 'DRIVER' ? (
                  <DriverDashboard currentUser={currentUser} onLogout={handleLogout} />
                ) : (
                  <PassengerDashboard currentUser={currentUser} onLogout={handleLogout} />
                )
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

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