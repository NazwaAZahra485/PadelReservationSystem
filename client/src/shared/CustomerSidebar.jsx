import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const CustomerSidebar = () => {
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
        { path: '/reservation', icon: '📅', label: 'Booking Lapangan' },
        // { path: '/my-bookings', icon: '🎟️', label: 'Riwayat Booking' }, // Nanti bisa ditambahkan
        { path: '/public', icon: '🏠', label: 'Home' },
    ];

    return (
        <aside className="public-sidebar" style={{ background: 'linear-gradient(180deg, #059669 0%, #047857 100%)' }}>
            <div className="public-header">
                <div className="public-brand">
                    <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}>🎾</div>
                    <div className="brand-text">
                        <span className="brand-name">Member Area</span>
                        <span className="brand-tagline">Padel Club</span>
                    </div>
                </div>
            </div>

            <nav className="public-nav">
                <div className="nav-section">
                    <span className="nav-section-title">Menu Member</span>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`public-link ${isActive(item.path)}`}
                        >
                            <span className="link-icon">{item.icon}</span>
                            <span className="link-text">{item.label}</span>
                            {isActive(item.path) && <span className="active-indicator" style={{ background: '#34d399', boxShadow: '0 0 10px #34d399' }}></span>}
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

export default CustomerSidebar;
