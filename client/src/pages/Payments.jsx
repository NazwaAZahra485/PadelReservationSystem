import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (paymentId, status, notes = '') => {
    try {
      await axios.put(`/api/payments/${paymentId}`, { status, notes }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Update local state
      setPayments(payments.map(payment =>
        payment.id === paymentId
          ? { ...payment, status, notes, approvedAt: new Date() }
          : payment
      ));
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'rejected': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'cash': return 'Cash at Venue';
      case 'virtual_account': return 'Virtual Account';
      case 'qr_code': return 'QR Code';
      default: return method;
    }
  };

  if (loading) return <div>Loading payments...</div>;

  return (
    <div>
      <h1 className="page-title">Payment Management</h1>

      {/* Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="card">
          <p>No payments found.</p>
        </div>
      ) : (
        <div className="payments-list">
          {filteredPayments.map(payment => (
            <div key={payment.id} className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h3 style={{ margin: '0', color: 'var(--text-main)' }}>
                      Payment #{payment.id}
                    </h3>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      color: 'white',
                      backgroundColor: getStatusColor(payment.status),
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {payment.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                      <strong>Customer:</strong> {payment.Reservation?.User?.name}
                    </div>
                    <div>
                      <strong>Court:</strong> {payment.Reservation?.Court?.name}
                    </div>
                    <div>
                      <strong>Date:</strong> {payment.Reservation?.date}
                    </div>
                    <div>
                      <strong>Time:</strong> {payment.Reservation?.startTime} - {payment.Reservation?.endTime}
                    </div>
                    <div>
                      <strong>Amount:</strong> Rp {payment.amount?.toLocaleString('id-ID')}
                    </div>
                    <div>
                      <strong>Method:</strong> {getPaymentMethodLabel(payment.method)}
                    </div>
                  </div>

                  {payment.paymentProof && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>Payment Proof:</strong>
                      <br />
                      <img
                        src={`http://localhost:4000/${payment.paymentProof}`}
                        alt="Payment Proof"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          marginTop: '5px'
                        }}
                      />
                    </div>
                  )}

                  {payment.notes && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>Notes:</strong> {payment.notes}
                    </div>
                  )}

                  {payment.approvedAt && (
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <strong>Processed:</strong> {new Date(payment.approvedAt).toLocaleString()}
                      {payment.approver && ` by ${payment.approver.name}`}
                    </div>
                  )}
                </div>

                {payment.status === 'pending' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '120px' }}>
                    <button
                      onClick={() => handleApproval(payment.id, 'approved')}
                      style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt('Reason for rejection:');
                        if (notes !== null) {
                          handleApproval(payment.id, 'rejected', notes);
                        }
                      }}
                      style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}