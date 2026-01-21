// client/src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper: Jika path cocok, beri class 'active' (warna kuning)
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    // remove auth token and redirect to login
    localStorage.removeItem('token');
    // clear stored user info as well
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Judul Sidebar */}
        <Link to="/dashboard" className={`sidebar-h2`}>
          Admin
        </Link>
        {/* <h2 style={{ paddingLeft: '15px' }}>Admin</h2> */}
      </div>
      
      <nav className="nav-menu">
        {/* 1. Dashboard */}
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
          Dashboard
        </Link>
        
        {/* 2. Management Lapangan */}
        <Link to="/courts" className={`nav-link ${isActive('/courts')}`}>
          Management Lapangan
        </Link>
        
        {/* 3. Management Event */}
        <Link to="/events" className={`nav-link ${isActive('/events')}`}>
          Management Event
        </Link>
        
        {/* 4. Pengajuan Owner */}
        <Link to="/applications" className={`nav-link ${isActive('/applications')}`}>
          Pengajuan Owner
        </Link>
        
        {/* 5. User Management */}
        <Link to="/users" className={`nav-link ${isActive('/users')}`}>
          User Management
        </Link>
        
        {/* 6. Settings */}
        <Link to="/settings" className={`nav-link ${isActive('/settings')}`}>
          Settings
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-link logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;