import React from 'react';

export default function OwnerDashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Owner Dashboard</h1>
      <p>Manage your venues and events here.</p>

      <section style={{ marginTop: 24, marginBottom: 24 }}>
        <h2>Appeal to Add New Venue</h2>
        <div style={{ 
          border: '1px solid #e0e0e0', 
          padding: 16, 
          borderRadius: 8,
          backgroundColor: '#f9f9f9',
          minHeight: 120
        }}>
          {/* Empty placeholder for now */}
          <p style={{ color: '#999' }}>Venue appeal form coming soon...</p>
        </div>
      </section>

      <section style={{ marginTop: 24, marginBottom: 24 }}>
        <h2>Edit My Listed Venues</h2>
        <div style={{ 
          border: '1px solid #e0e0e0', 
          padding: 16, 
          borderRadius: 8,
          backgroundColor: '#f9f9f9',
          minHeight: 120
        }}>
          {/* Empty placeholder for now */}
          <p style={{ color: '#999' }}>Your venues list coming soon...</p>
        </div>
      </section>

      <section style={{ marginTop: 24, marginBottom: 24 }}>
        <h2>Add Event</h2>
        <div style={{ 
          border: '1px solid #e0e0e0', 
          padding: 16, 
          borderRadius: 8,
          backgroundColor: '#f9f9f9',
          minHeight: 120
        }}>
          {/* Empty placeholder for now */}
          <p style={{ color: '#999' }}>Event creation form coming soon...</p>
        </div>
      </section>

      <section style={{ marginTop: 24, marginBottom: 24 }}>
        <h2>Edit My Events</h2>
        <div style={{ 
          border: '1px solid #e0e0e0', 
          padding: 16, 
          borderRadius: 8,
          backgroundColor: '#f9f9f9',
          minHeight: 120
        }}>
          {/* Empty placeholder for now */}
          <p style={{ color: '#999' }}>Your events list coming soon...</p>
        </div>
      </section>
    </div>
  );
}
