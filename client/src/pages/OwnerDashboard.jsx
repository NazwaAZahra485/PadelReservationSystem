import React from 'react';
import { Link } from 'react-router-dom';

export default function OwnerDashboard() {
  return (
    <div>
      <h1 className="page-title">Owner Dashboard</h1>

      {/* Grid 2 kolom - Stats Overview */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="card">
          <h3>Total Venues</h3>
          <div className="value">0</div>
        </div>

        <div className="card blue-accent">
          <h3>Total Events</h3>
          <div className="value">0</div>
        </div>
      </div>

      {/* Section: Appeal New Venue */}
      <section style={{ marginTop: 30, marginBottom: 30 }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px' }}>Appeal New Venue</h2>
        <div className="card">
          <p style={{ color: '#666', marginBottom: '16px' }}>Request to add a new venue to the system. Admin will review your appeal.</p>
          <Link to="/owner/venue-appeal">
            <button style={{
              backgroundColor: 'var(--primary-blue)',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Appeal for New Venue
            </button>
          </Link>
        </div>
      </section>

      {/* Section: My Venues */}
      <section style={{ marginTop: 30, marginBottom: 30 }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px' }}>My Venues</h2>
        <div className="card">
          <p style={{ color: '#999' }}>Your venues list coming soon...</p>
        </div>
      </section>

      {/* Section: My Events */}
      <section style={{ marginTop: 30, marginBottom: 30 }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px' }}>My Events</h2>
        <div className="card">
          <p style={{ color: '#999' }}>Your events list coming soon...</p>
        </div>
      </section>
    </div>
  );
}
