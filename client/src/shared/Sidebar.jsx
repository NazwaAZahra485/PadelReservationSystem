import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
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

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/courts', icon: '🏟️', label: 'Lapangan' },
    { path: '/events', icon: '🎉', label: 'Events' },
    { path: '/applications', icon: '📝', label: 'Pengajuan' },
    { path: '/reports', icon: '📈', label: 'Laporan' },
    { path: '/users', icon: '👥', label: 'Users' },
    { path: '/database', icon: '💾', label: 'Database' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <aside className="public-sidebar"> {/* Menggunakan class public-sidebar agar style sama */}
      <div className="public-header">
        <div className="public-brand">
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>🛡️</div>
          <div className="brand-text">
            <span className="brand-name">Admin Panel</span>
            <span className="brand-tagline">Management System</span>
          </div>
        </div>
      </div>

      <nav className="public-nav">
        <div className="nav-section">
          <span className="nav-section-title">Main Menu</span>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`public-link ${isActive(item.path)}`}
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-text">{item.label}</span>
              {isActive(item.path) && <span className="active-indicator"></span>}
            </Link>
          ))}
        </div>
      </nav>

      <div className="public-footer">
        <button onClick={handleLogout} className="public-cta" style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <span className="cta-icon">🚪</span>
          <span className="cta-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;