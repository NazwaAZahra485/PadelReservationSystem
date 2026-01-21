import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function OwnerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/owner/dashboard" className="sidebar-h2">
          Owner Portal
        </Link>
      </div>

      <nav className="nav-menu">
        <Link to="/owner/dashboard" className={`nav-link ${isActive('/owner/dashboard')}`}>
          Dashboard
        </Link>

        <Link to="/owner/venues" className={`nav-link ${isActive('/owner/venues')}`}>
          My Venues
        </Link>

        <Link to="/owner/events" className={`nav-link ${isActive('/owner/events')}`}>
          My Events
        </Link>

        <Link to="/owner/appeals" className={`nav-link ${isActive('/owner/appeals')}`}>
          Appeal New Venue
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
