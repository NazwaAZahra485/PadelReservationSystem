import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PublicSidebar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/public';
    }
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/courts-public', icon: '🏟️', label: 'Lapangan' },
    { path: '/events-public', icon: '🎉', label: 'Events' },
    { path: '/contact', icon: '📞', label: 'Kontak' },
  ];

  return (
    <aside className="public-sidebar">
      {/* Logo & Brand */}
      <div className="public-header">
        <Link to="/" className="public-brand">
          <div className="brand-icon">🎾</div>
          <div className="brand-text">
            <span className="brand-name">Padel Club</span>
            <span className="brand-tagline">Premium Courts</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="public-nav">
        <div className="nav-section">
          <span className="nav-section-title">Menu</span>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`public-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-text">{item.label}</span>
              {isActive(item.path) && <span className="active-indicator"></span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="sidebar-stats">
        <div className="stat-item">
          <span className="stat-value">4</span>
          <span className="stat-label">Courts</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">24/7</span>
          <span className="stat-label">Open</span>
        </div>
      </div>

      {/* Footer */}
      <div className="public-footer">
        <Link to="/login" className="public-cta">
          <span className="cta-icon">🔐</span>
          <span className="cta-text">Admin Login</span>
        </Link>
        <p className="copyright">© 2026 Padel Club</p>
      </div>
    </aside>
  );
}
