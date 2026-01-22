import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function Reservation() {
    const navigate = useNavigate();
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        courtId: '',
        date: '',
        startTime: '',
        endTime: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            // Ambil user dari localStorage
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/login');
                return;
            }
            const user = JSON.parse(userStr);

            const payload = {
                ...formData,
                userId: user.id,
                status: 'pending'
            };

            const res = await apiFetch('/reservations', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccess('Reservasi berhasil dibuat! Menunggu konfirmasi admin.');
                setFormData({
                    courtId: courts[0]?.id || '',
                    date: '',
                    startTime: '',
                    endTime: ''
                });
            } else {
                const json = await res.json();
                setError(json.message || 'Gagal membuat reservasi');
            }
        } catch (err) {
            setError('Terjadi kesalahan sistem');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    return (
        <div className="reservation-page">
            <div className="reservation-container">
                <div className="reservation-header">
                    <h1>📅 Booking Lapangan</h1>
                    <p>Pilih jadwal bermain padel Anda sekarang</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="reservation-form">
                    <div className="form-group">
                        <label>Pilih Lapangan</label>
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
                                        <span className="court-price">Rp {court.pricePerHour?.toLocaleString()}/jam</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

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

                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? 'Memproses...' : 'Konfirmasi Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
