import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Booking() {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Available time slots (9 AM to 10 PM)
  const timeSlots = [];
  for (let hour = 9; hour < 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await axios.get('/api/courts');
      // Filter out courts under maintenance
      const availableCourts = response.data.filter(court => !court.maintenance);
      setCourts(availableCourts);
    } catch (error) {
      console.error('Error fetching courts:', error);
    }
  };

  const calculateAmount = () => {
    if (!selectedCourt || !selectedTime) return 0;
    const court = courts.find(c => c.id.toString() === selectedCourt);
    if (!court) return 0;

    // Assume 1 hour booking for simplicity
    return court.pricePerHour || 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage('File size must be less than 5MB');
      return;
    }
    setPaymentProof(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // First create the reservation
      const reservationData = {
        date: selectedDate,
        startTime: selectedTime,
        endTime: addHours(selectedTime, 1), // Assume 1 hour booking
        userId: 1, // This should come from user context/auth
        courtId: selectedCourt
      };

      const reservationResponse = await axios.post('/api/reservations', reservationData);
      const reservationId = reservationResponse.data.id;

      // Then create the payment
      const formData = new FormData();
      formData.append('reservationId', reservationId);
      formData.append('method', paymentMethod);
      formData.append('amount', calculateAmount());

      if (paymentProof && (paymentMethod === 'virtual_account' || paymentMethod === 'qr_code')) {
        formData.append('paymentProof', paymentProof);
      }

      await axios.post('/api/payments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(paymentMethod === 'cash'
        ? 'Reservation confirmed! Please pay at the venue.'
        : 'Reservation submitted! Please wait for payment approval.'
      );

      // Reset form
      setSelectedCourt('');
      setSelectedDate('');
      setSelectedTime('');
      setPaymentMethod('');
      setPaymentProof(null);

    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addHours = (time, hours) => {
    const [hour, minute] = time.split(':').map(Number);
    const newHour = (hour + hours) % 24;
    return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const isFormValid = selectedCourt && selectedDate && selectedTime && paymentMethod &&
    (paymentMethod === 'cash' || paymentProof);

  return (
    <div>
      <h1 className="page-title">Book a Court</h1>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Court Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Court
            </label>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="">Choose a court...</option>
              {courts.map(court => (
                <option key={court.id} value={court.id}>
                  {court.name} - Rp {court.pricePerHour?.toLocaleString('id-ID')}/hour
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          {/* Time Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Start Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="">Choose time...</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Payment Method
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash at Venue
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="virtual_account"
                  checked={paymentMethod === 'virtual_account'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Virtual Account
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qr_code"
                  checked={paymentMethod === 'qr_code'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                QR Code
              </label>
            </div>
          </div>

          {/* Payment Proof Upload */}
          {(paymentMethod === 'virtual_account' || paymentMethod === 'qr_code') && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Upload Payment Proof
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                Upload a screenshot of your payment (max 5MB)
              </p>
            </div>
          )}

          {/* Amount Display */}
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Total Amount: Rp {calculateAmount().toLocaleString('id-ID')}</strong>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              backgroundColor: isFormValid ? 'var(--primary-blue)' : '#ccc',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
              width: '100%',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Processing...' : 'Book Court'}
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '16px',
            color: message.includes('error') || message.includes('Error') ? 'red' : 'green',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}