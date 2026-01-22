import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function PublicBooking() {
    const navigate = useNavigate();
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        courtId: '',
        date: '',
        startTime: '',
        endTime: '',
        // Data Tamu
        guestName: '',
        guestPhone: '',
        guestEmail: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCourts();
    }, []);

    const fetchCourts = async () => {
        try {
            // Gunakan endpoint public atau endpoint biasa (pastikan tidak diproteksi middleware auth di backend jika belum login)
            // Di sini kita pakai /courts, asumsikan public read access
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                ...formData,
                status: 'pending'
            };

            const res = await apiFetch('/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccess('Permintaan booking berhasil dikirim! Admin kami akan segera menghubungi Anda via WhatsApp/Email untuk konfirmasi.');
                // Reset form
                setFormData({
                    courtId: courts[0]?.id || '',
                    date: '',
                    startTime: '',
                    endTime: '',
                    guestName: '',
                    guestPhone: '',
                    guestEmail: ''
                });
            } else {
                const json = await res.json();
                setError(json.message || 'Gagal membuat reservasi');
            }
        } catch (err) {
            setError('Terjadi kesalahan sistem. Silakan coba lagi.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    return (
        <div className="reservation-page">
            <div className="reservation-container">
                <div className="reservation-header">
                    <h1>📅 Booking Lapangan (Public)</h1>
                    <p>Isi data diri dan pilih jadwal bermain Anda</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="reservation-form">

                    {/* BAGIAN 1: PILIH LAPANGAN */}
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

                    {/* BAGIAN 2: JADWAL */}
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

                    {/* BAGIAN 3: DATA DIRI */}
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
                        {submitting ? 'Memproses...' : 'Kirim Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
