import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';

// --- COMPONENT CARD LAPANGAN PUBLIC ---
const PublicCourtCard = ({ court }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const serverUrl = 'http://localhost:4000';
    const images = Array.isArray(court.images) && court.images.length > 0
        ? court.images.map(img => img.startsWith('http') ? img : `${serverUrl}${img}`)
        : ['https://via.placeholder.com/600x400?text=Padel+Court'];

    const nextSlide = (e) => {
        e.preventDefault();
        setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = (e) => {
        e.preventDefault();
        setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="public-card">
            <div className="card-image-container">
                <img src={images[currentSlide]} alt={court.name} className="card-image" />
                <div className="card-badge">{court.type}</div>

                {images.length > 1 && (
                    <>
                        <button onClick={prevSlide} className="slider-btn prev">‹</button>
                        <button onClick={nextSlide} className="slider-btn next">›</button>
                    </>
                )}
            </div>

            <div className="card-content">
                <h3 className="card-title">{court.name}</h3>
                <p className="card-location">📍 {court.location || 'Lokasi tersedia'}</p>
                <p className="card-description">{court.description || 'Lapangan kualitas terbaik untuk permainan maksimal.'}</p>

                <div className="card-footer">
                    <div className="price-tag">
                        <span className="currency">Rp</span>
                        <span className="amount">{Number(court.price || 0).toLocaleString('id-ID')}</span>
                        <span className="period">/ jam</span>
                    </div>
                    <Link to="/booking" className="btn-book">
                        Booking Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function CourtsPublic() {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourts();
    }, []);

    const fetchCourts = async () => {
        try {
            const res = await apiFetch('/courts');
            const data = await res.json();
            setCourts(data);
        } catch (err) {
            console.error('Gagal ambil data lapangan', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="public-page-container">
            <div className="page-header-public">
                <h1>🏟️ Pilihan Lapangan</h1>
                <p>Temukan lapangan padel terbaik sesuai kebutuhan Anda</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <div className="public-grid">
                    {courts.map(court => (
                        <PublicCourtCard key={court.id} court={court} />
                    ))}
                </div>
            )}

            {courts.length === 0 && !loading && (
                <div className="empty-state">
                    <p>Belum ada lapangan yang tersedia saat ini.</p>
                </div>
            )}
        </div>
    );
}
