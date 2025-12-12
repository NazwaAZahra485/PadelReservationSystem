// client/src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  // Helper: Jika path cocok, beri class 'active' (warna kuning)
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Judul Sidebar */}
        <h2 style={{ paddingLeft: '15px' }}>Admin</h2>
      </div>
      
      <nav className="nav-menu">
        {/* 1. Dashboard */}
        <Link to="/" className={`nav-link ${isActive('/')}`}>
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
    </div>
  );
};

export default Sidebar;