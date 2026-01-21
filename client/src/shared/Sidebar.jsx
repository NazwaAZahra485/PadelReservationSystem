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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Judul Sidebar */}
        <h2 style={{ paddingLeft: '15px' }}>Admin</h2>
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

        {/* --- MENU BARU: LAPORAN --- */}
        <Link to="/reports" className={`nav-link ${isActive('/reports')}`}>
          Laporan
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

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;