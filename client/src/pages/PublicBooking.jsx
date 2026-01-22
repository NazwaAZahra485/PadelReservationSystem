import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function PublicBooking() {
    const navigate = useNavigate();
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState('booking'); // booking, payment, success

    // Form Data
    const [formData, setFormData] = useState({
        courtId: '',
        date: '',
        startTime: '',
        endTime: '',
        guestName: '',
        guestPhone: '',
        guestEmail: ''
    });

    // Payment State
    const [reservationId, setReservationId] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('virtual_account');
    const [paymentProof, setPaymentProof] = useState(null);
    const [paymentSubmitting, setPaymentSubmitting] = useState(false);
    const [vaNumber, setVaNumber] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourts();
    }, []);

    const fetchCourts = async () => {
        try {
            const res = await apiFetch('/courts');
            const data = await res.json();
            setCourts(data);
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, courtId: data[0].id }));
            }
        } catch (err) {
            console.error('Gagal ambil data lapangan', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setPaymentProof(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await apiFetch('/reservations', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setReservationId(data.id);
                setTotalAmount(data.totalPrice);
                setStep('payment');
                window.scrollTo(0, 0);
            } else {
                setError(data.message || 'Gagal membuat reservasi');
            }
        } catch (err) {
            setError('Terjadi kesalahan sistem. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentSubmitting(true);
        setError('');

        try {
            const paymentFormData = new FormData();
            paymentFormData.append('reservationId', reservationId);
            paymentFormData.append('method', paymentMethod);
            paymentFormData.append('amount', totalAmount);
            if (paymentProof) {
                paymentFormData.append('paymentProof', paymentProof);
            }

            const res = await apiFetch('/payments', {
                method: 'POST',
                body: paymentFormData
            });

            const data = await res.json();
            if (res.ok) {
                if (paymentMethod === 'virtual_account') {
                    const vaMatch = data.notes?.match(/VA Number: (\d+)/);
                    if (vaMatch) setVaNumber(vaMatch[1]);
                }
                setStep('success');
                window.scrollTo(0, 0);
            } else {
                setError(data.error || 'Gagal memproses pembayaran');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengirim pembayaran.');
        } finally {
            setPaymentSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    if (step === 'payment') {
        return (
            <div className="reservation-page">
                <div className="reservation-container">
                    <div className="reservation-header">
                        <h1>💳 Pembayaran</h1>
                        <p>Silakan selesaikan pembayaran untuk mengonfirmasi booking Anda</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="payment-summary-card">
                        <h3>Ringkasan Pesanan</h3>
                        <div className="summary-grid">
                            <div className="summary-col">
                                <label>ID Reservasi</label>
                                <span>#{reservationId}</span>
                            </div>
                            <div className="summary-col">
                                <label>Total Bayar</label>
                                <span className="total-price">Rp {parseInt(totalAmount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handlePaymentSubmit}>
                        <div className="form-group">
                            <label>Pilih Metode Pembayaran</label>
                            <div className="payment-methods">
                                <div
                                    className={`method-option ${paymentMethod === 'virtual_account' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('virtual_account')}
                                >
                                    <div className="method-card">
                                        <span className="method-icon">🏦</span>
                                        <span className="method-name">Virtual Account</span>
                                    </div>
                                </div>
                                <div
                                    className={`method-option ${paymentMethod === 'transfer' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('transfer')}
                                >
                                    <div className="method-card">
                                        <span className="method-icon">💸</span>
                                        <span className="method-name">Transfer Bank</span>
                                    </div>
                                </div>
                                <div
                                    className={`method-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('cash')}
                                >
                                    <div className="method-card">
                                        <span className="method-icon">💵</span>
                                        <span className="method-name">Bayar di Tempat</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {paymentMethod === 'virtual_account' && (
                            <div className="va-instructions">
                                <div className="va-info">
                                    <p>Gunakan nomor Virtual Account berikut untuk pembayaran otomatis:</p>
                                    <div className="va-card">
                                        <div className="va-label">BANK MANDIRI / BNI / BRI</div>
                                        <div className="va-number">8806 0812 3456 7890</div>
                                        <div className="va-label">A/N PADEL RESERVATION</div>
                                    </div>
                                </div>
                                <p className="note" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    * Pembayaran via Virtual Account akan diverifikasi secara otomatis.
                                </p>
                            </div>
                        )}

                        {paymentMethod === 'transfer' && (
                            <div className="transfer-instructions">
                                <div className="bank-info">
                                    <p>Silakan transfer ke rekening berikut:</p>
                                    <div className="bank-card">
                                        <div className="account-name">BANK BCA</div>
                                        <div className="account-number">123-456-7890</div>
                                        <div className="account-name">A/N PT PADEL INDONESIA</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Upload Bukti Transfer</label>
                                    <div className="file-upload-wrapper">
                                        <input
                                            type="file"
                                            id="paymentProof"
                                            onChange={handleFileChange}
                                            className="file-input"
                                            accept="image/*"
                                            required={paymentMethod === 'transfer'}
                                        />
                                        <label htmlFor="paymentProof" className="file-label">
                                            {paymentProof ? `📄 ${paymentProof.name}` : '📁 Pilih Foto Bukti Transfer'}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'cash' && (
                            <div className="cash-instructions">
                                <p>Anda dapat membayar langsung di kasir saat tiba di lokasi.</p>
                                <p className="note">Mohon datang 15 menit sebelum jadwal bermain.</p>
                            </div>
                        )}

                        <div className="payment-actions">
                            <button type="button" className="btn-back" onClick={() => setStep('booking')}>Kembali</button>
                            <button type="submit" className="btn-submit" disabled={paymentSubmitting}>
                                {paymentSubmitting ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="reservation-page">
                <div className="reservation-container success-view">
                    <div className="success-icon">✅</div>
                    <h1>Booking Berhasil!</h1>
                    <p>Terima kasih telah melakukan pemesanan di Padel Reservation System.</p>

                    <div className="booking-summary">
                        <div className="summary-item">
                            <span>ID Reservasi:</span>
                            <strong>#{reservationId}</strong>
                        </div>
                        <div className="summary-item">
                            <span>Metode:</span>
                            <strong>{paymentMethod.replace('_', ' ').toUpperCase()}</strong>
                        </div>
                        {vaNumber && (
                            <div className="summary-item">
                                <span>Nomor VA:</span>
                                <strong>{vaNumber}</strong>
                            </div>
                        )}
                        <div className="summary-item">
                            <span>Status:</span>
                            <strong>{paymentMethod === 'cash' ? 'Dikonfirmasi' : 'Menunggu Verifikasi'}</strong>
                        </div>
                    </div>

                    <p style={{ marginBottom: '30px', color: '#64748b' }}>
                        Detail reservasi telah dikirim ke WhatsApp/Email Anda. Silakan tunjukkan ID Reservasi saat tiba di lokasi.
                    </p>

                    <button className="btn-submit" onClick={() => navigate('/')}>Kembali ke Beranda</button>
                </div>
            </div>
        );
    }

    return (
        <div className="reservation-page">
            <div className="reservation-container">
                <div className="reservation-header">
                    <h1>📅 Booking Lapangan</h1>
                    <p>Isi data diri dan pilih jadwal bermain Anda</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="reservation-form">
                    <div className="form-group">
                        <label>1. Pilih Lapangan</label>
                        <div className="court-selection">
                            {courts.map(court => (
                                <label key={court.id} className={`court-option ${parseInt(formData.courtId) === court.id ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="courtId"
                                        value={court.id}
                                        checked={parseInt(formData.courtId) === court.id}
                                        onChange={handleChange}
                                        hidden
                                    />
                                    <div className="court-card-mini">
                                        <span className="court-icon">🏟️</span>
                                        <span className="court-name">{court.name}</span>
                                        <span className="court-type">{court.type}</span>
                                        <span className="court-price">Rp {parseInt(court.price).toLocaleString()}/jam</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <label style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', display: 'block', color: '#2563eb' }}>2. Pilih Jadwal</label>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tanggal Main</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Jam Mulai</label>
                                <select name="startTime" value={formData.startTime} onChange={handleChange} required className="form-input">
                                    <option value="">Pilih Jam</option>
                                    {Array.from({ length: 15 }, (_, i) => i + 7).map(h => (
                                        <option key={h} value={`${h < 10 ? '0' + h : h}:00`}>{`${h < 10 ? '0' + h : h}:00`}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Jam Selesai</label>
                                <select name="endTime" value={formData.endTime} onChange={handleChange} required className="form-input">
                                    <option value="">Pilih Jam</option>
                                    {Array.from({ length: 15 }, (_, i) => i + 8).map(h => (
                                        <option key={h} value={`${h < 10 ? '0' + h : h}:00`}>{`${h < 10 ? '0' + h : h}:00`}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <label style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', display: 'block', color: '#2563eb' }}>3. Data Pemesan</label>
                        <div className="form-group">
                            <label>Nama Lengkap</label>
                            <input
                                type="text"
                                name="guestName"
                                value={formData.guestName}
                                onChange={handleChange}
                                required
                                placeholder="Masukkan nama lengkap Anda"
                                className="form-input"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Nomor WhatsApp / HP</label>
                                <input
                                    type="tel"
                                    name="guestPhone"
                                    value={formData.guestPhone}
                                    onChange={handleChange}
                                    required
                                    placeholder="08xxxxxxxxxx"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email (Opsional)</label>
                                <input
                                    type="email"
                                    name="guestEmail"
                                    value={formData.guestEmail}
                                    onChange={handleChange}
                                    placeholder="email@contoh.com"
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                    </button>
                </form>
            </div>
        </div>
    );
}
