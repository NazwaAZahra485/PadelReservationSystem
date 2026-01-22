import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';

const PublicEventCard = ({ event }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const serverUrl = 'http://localhost:4000';
    const images = Array.isArray(event.images) && event.images.length > 0
        ? event.images.map(img => img.startsWith('http') ? img : `${serverUrl}${img}`)
        : ['https://via.placeholder.com/600x400?text=Event+Padel'];

    const nextSlide = (e) => {
        e.preventDefault();
        setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = (e) => {
        e.preventDefault();
        setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="public-card event-card">
            <div className="card-image-container">
                <img src={images[currentSlide]} alt={event.title} className="card-image" />
                <div className="event-date-badge">
                    {formatDate(event.date)}
                </div>

                {images.length > 1 && (
                    <>
                        <button onClick={prevSlide} className="slider-btn prev">‹</button>
                        <button onClick={nextSlide} className="slider-btn next">›</button>
                    </>
                )}
            </div>

            <div className="card-content">
                <h3 className="card-title">{event.title}</h3>
                <p className="card-location">📍 {event.location || 'Lokasi TBA'}</p>
                <p className="card-description">{event.description || 'Ikuti keseruan event padel kami!'}</p>

                <div className="card-footer">
                    <button className="btn-details">
                        Lihat Detail
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function EventsPublic() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await apiFetch('/events');
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            console.error('Gagal ambil data event', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="public-page-container">
            <div className="page-header-public">
                <h1>🎉 Event & Turnamen</h1>
                <p>Jangan lewatkan berbagai kegiatan seru di Padel Club</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <div className="public-grid">
                    {events.map(event => (
                        <PublicEventCard key={event.id} event={event} />
                    ))}
                </div>
            )}

            {events.length === 0 && !loading && (
                <div className="empty-state">
                    <p>Belum ada event yang dijadwalkan dalam waktu dekat.</p>
                </div>
            )}
        </div>
    );
}
