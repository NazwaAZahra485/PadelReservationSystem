import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VenueAppealForm() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    contactInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/venue-appeals', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Venue appeal submitted successfully!');
      setTimeout(() => navigate('/owner/dashboard'), 2000);
    } catch (error) {
      setMessage('Error submitting appeal. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Appeal for New Venue</h1>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Venue Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="location" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="contactInfo" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Contact Information
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'var(--primary-blue)',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Appeal'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '16px', color: message.includes('Error') ? 'red' : 'green' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}