import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VenueAppeals() {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppeals();
  }, []);

  const fetchAppeals = async () => {
    try {
      const response = await axios.get('/api/venue-appeals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAppeals(response.data);
    } catch (error) {
      setError('Failed to load venue appeals');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppealStatus = async (id, status) => {
    try {
      await axios.put(`/api/venue-appeals/${id}`, { status }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Update local state
      setAppeals(appeals.map(appeal =>
        appeal.id === id ? { ...appeal, status } : appeal
      ));
    } catch (error) {
      setError('Failed to update appeal status');
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'rejected': return '#f44336';
      default: return '#ff9800';
    }
  };

  if (loading) return <div>Loading venue appeals...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1 className="page-title">Venue Appeals</h1>

      {appeals.length === 0 ? (
        <div className="card">
          <p>No venue appeals found.</p>
        </div>
      ) : (
        <div className="appeals-list">
          {appeals.map(appeal => (
            <div key={appeal.id} className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>{appeal.name}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}><strong>Location:</strong> {appeal.location}</p>
                  <p style={{ margin: '5px 0', color: '#666' }}><strong>Contact:</strong> {appeal.contactInfo}</p>
                  <p style={{ margin: '5px 0', color: '#666' }}><strong>Owner:</strong> {appeal.owner?.name} ({appeal.owner?.email})</p>
                  {appeal.description && (
                    <p style={{ margin: '5px 0', color: '#666' }}><strong>Description:</strong> {appeal.description}</p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    padding: '5px 10px',
                    borderRadius: '4px',
                    color: 'white',
                    backgroundColor: getStatusColor(appeal.status),
                    display: 'inline-block',
                    marginBottom: '10px'
                  }}>
                    {appeal.status.toUpperCase()}
                  </div>
                  {appeal.status === 'pending' && (
                    <div>
                      <button
                        onClick={() => updateAppealStatus(appeal.id, 'approved')}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          marginRight: '5px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateAppealStatus(appeal.id, 'rejected')}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}