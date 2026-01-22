import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicSidebar() {
  return (
    <aside className="public-sidebar">
      <div className="public-header">
        <Link to="/" className="public-title">Padel Club</Link>
      </div>

      <nav className="public-nav">
        <Link to="/" className="public-link">Home</Link>
        <Link to="/courts" className="public-link">Courts</Link>
        <Link to="/events" className="public-link">Events</Link>
        <Link to="/public" className="public-link">Contact</Link>
      </nav>

      <div className="public-footer">
        <Link to="/login" className="public-cta">Admin Login</Link>
      </div>
    </aside>
  );
}
