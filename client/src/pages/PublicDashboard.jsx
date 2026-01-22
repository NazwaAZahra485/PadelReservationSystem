import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicDashboard() {
  return (
    <div className="public-dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🎾 Selamat Datang</div>
          <h1 className="hero-title">
            Padel Club <span className="highlight">Premium</span>
          </h1>
          <p className="hero-subtitle">
            Nikmati pengalaman bermain padel terbaik dengan fasilitas lapangan
            berkualitas tinggi dan layanan profesional.
          </p>
          <div className="hero-actions">
            <Link to="/courts-public" className="btn-primary">
              <span>🏟️</span> Lihat Lapangan
            </Link>
            <Link to="/events-public" className="btn-secondary">
              <span>🎉</span> Events Terbaru
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <span className="card-icon">🏟️</span>
            <span className="card-text">Indoor & Outdoor</span>
          </div>
          <div className="floating-card card-2">
            <span className="card-icon">⭐</span>
            <span className="card-text">Premium Quality</span>
          </div>
          <div className="floating-card card-3">
            <span className="card-icon">🕐</span>
            <span className="card-text">24/7 Available</span>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="stats-section">
        <div className="stats-header">
          <h2>🎾 Tentang Kami</h2>
          <p>Padel Club terbaik dengan fasilitas premium</p>
        </div>
        <div className="stats-grid-public">
          <div className="stat-card">
            <div className="stat-icon users">🏟️</div>
            <div className="stat-info">
              <span className="stat-number">4</span>
              <span className="stat-label">Lapangan</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon courts">⭐</div>
            <div className="stat-info">
              <span className="stat-number">5.0</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon reservations">👥</div>
            <div className="stat-info">
              <span className="stat-number">500+</span>
              <span className="stat-label">Member</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon events">🏆</div>
            <div className="stat-info">
              <span className="stat-number">50+</span>
              <span className="stat-label">Turnamen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>✨ Fasilitas Kami</h2>
          <p>Semua yang Anda butuhkan untuk bermain padel</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏟️</div>
            <h3>Lapangan Premium</h3>
            <p>4 lapangan berkualitas tinggi dengan standar internasional untuk pengalaman bermain terbaik.</p>
            <Link to="/courts-public" className="feature-link">
              Lihat Lapangan <span>→</span>
            </Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎉</div>
            <h3>Events & Turnamen</h3>
            <p>Ikuti berbagai event menarik mulai dari turnamen sampai workshop untuk semua level.</p>
            <Link to="/events-public" className="feature-link">
              Lihat Events <span>→</span>
            </Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Reservasi Mudah</h3>
            <p>Sistem reservasi online yang mudah dan cepat. Booking lapangan kapan saja, di mana saja.</p>
            <Link to="/login" className="feature-link">
              Booking Sekarang <span>→</span>
            </Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Coaching Professional</h3>
            <p>Pelatih profesional tersertifikasi siap membantu Anda meningkatkan skill padel.</p>
            <Link to="/contact" className="feature-link">
              Hubungi Kami <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>🚀 Siap Bermain Padel?</h2>
          <p>Booking lapangan sekarang dan nikmati pengalaman bermain terbaik!</p>
          <Link to="/login" className="cta-button">
            <span>📅</span> Reservasi Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
