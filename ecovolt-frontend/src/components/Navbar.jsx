import './Navbar.css';

function Navbar({ user, onLogout }) {
  if (!user) return null; // Safety check: Don't render if no user

  // Get the first letter of the name for the avatar
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      {/* 1. Brand Logo */}
      <div className="navbar-brand">
        🌱 Eco<span className="brand-highlight">Volt</span>
      </div>

      {/* 2. Center Links */}
      <div className="navbar-center">
        <span className="nav-link active">Home</span>
        {user.role === 'PASSENGER' && <span className="nav-link">History</span>}
        {user.role === 'DRIVER' && <span className="nav-link">Earnings</span>}
        <span className="nav-link">Support</span>
      </div>

      {/* 3. User Profile & Logout */}
      <div className="navbar-right">
        <div className="user-info">
          {/* Avatar Circle */}
          <div className="user-avatar">{initial}</div>
          
          {/* Name & Role Text */}
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;