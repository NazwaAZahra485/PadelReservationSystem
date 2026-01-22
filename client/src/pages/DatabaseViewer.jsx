// client/src/pages/DatabaseViewer.jsx
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';

function DatabaseViewer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/data/all');
            const json = await res.json();

            if (json.success) {
                setData(json);
                setError(null);
            } else {
                setError(json.message || 'Gagal mengambil data');
            }
        } catch (err) {
            setError('Tidak dapat terhubung ke server. Pastikan server berjalan.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (items, columns) => {
        if (!items || items.length === 0) {
            return <p className="no-data">Tidak ada data</p>;
        }

        return (
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={item.id || idx}>
                                {columns.map(col => (
                                    <td key={col.key}>
                                        {col.render ? col.render(item[col.key], item) : (item[col.key] ?? '-')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const userColumns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nama' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'createdAt', label: 'Dibuat Pada', render: (val) => val ? new Date(val).toLocaleString('id-ID') : '-' }
    ];

    const courtColumns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nama Lapangan' },
        { key: 'location', label: 'Lokasi' },
        { key: 'type', label: 'Tipe' },
        { key: 'pricePerHour', label: 'Harga/Jam', render: (val) => val ? `Rp ${val.toLocaleString('id-ID')}` : '-' },
        { key: 'createdAt', label: 'Dibuat Pada', render: (val) => val ? new Date(val).toLocaleString('id-ID') : '-' }
    ];

    const reservationColumns = [
        { key: 'id', label: 'ID' },
        { key: 'date', label: 'Tanggal' },
        { key: 'startTime', label: 'Jam Mulai' },
        { key: 'endTime', label: 'Jam Selesai' },
        {
            key: 'status', label: 'Status', render: (val) => (
                <span className={`status-badge status-${val?.toLowerCase()}`}>{val || '-'}</span>
            )
        },
        { key: 'User', label: 'User', render: (val) => val?.name || '-' },
        { key: 'Court', label: 'Lapangan', render: (val) => val?.name || '-' },
        { key: 'createdAt', label: 'Dibuat Pada', render: (val) => val ? new Date(val).toLocaleString('id-ID') : '-' }
    ];

    const eventColumns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Judul' },
        { key: 'description', label: 'Deskripsi' },
        { key: 'date', label: 'Tanggal' },
        { key: 'createdAt', label: 'Dibuat Pada', render: (val) => val ? new Date(val).toLocaleString('id-ID') : '-' }
    ];

    if (loading) {
        return (
            <div className="database-viewer">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Memuat data dari database...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="database-viewer">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchAllData} className="retry-btn">Coba Lagi</button>
                </div>
            </div>
        );
    }

    return (
        <div className="database-viewer">
            <div className="page-header">
                <h1>📊 Database Viewer</h1>
                <p className="subtitle">Data lengkap dari database <strong>padel_db</strong></p>
                <button onClick={fetchAllData} className="refresh-btn">
                    🔄 Refresh Data
                </button>
            </div>

            {/* Summary Cards */}
            {data?.summary && (
                <div className="summary-cards">
                    <div className="summary-card users">
                        <div className="card-icon">👥</div>
                        <div className="card-info">
                            <span className="card-value">{data.summary.totalUsers}</span>
                            <span className="card-label">Users</span>
                        </div>
                    </div>
                    <div className="summary-card courts">
                        <div className="card-icon">🏟️</div>
                        <div className="card-info">
                            <span className="card-value">{data.summary.totalCourts}</span>
                            <span className="card-label">Lapangan</span>
                        </div>
                    </div>
                    <div className="summary-card reservations">
                        <div className="card-icon">📅</div>
                        <div className="card-info">
                            <span className="card-value">{data.summary.totalReservations}</span>
                            <span className="card-label">Reservasi</span>
                        </div>
                    </div>
                    <div className="summary-card events">
                        <div className="card-icon">🎉</div>
                        <div className="card-info">
                            <span className="card-value">{data.summary.totalEvents}</span>
                            <span className="card-label">Events</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    📋 Semua Data
                </button>
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Users
                </button>
                <button
                    className={`tab-btn ${activeTab === 'courts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('courts')}
                >
                    🏟️ Lapangan
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reservations')}
                >
                    📅 Reservasi
                </button>
                <button
                    className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => setActiveTab('events')}
                >
                    🎉 Events
                </button>
            </div>

            {/* Data Tables */}
            <div className="data-sections">
                {(activeTab === 'all' || activeTab === 'users') && (
                    <div className="data-section">
                        <h2>👥 Tabel Users</h2>
                        {renderTable(data?.data?.users, userColumns)}
                    </div>
                )}

                {(activeTab === 'all' || activeTab === 'courts') && (
                    <div className="data-section">
                        <h2>🏟️ Tabel Lapangan (Courts)</h2>
                        {renderTable(data?.data?.courts, courtColumns)}
                    </div>
                )}

                {(activeTab === 'all' || activeTab === 'reservations') && (
                    <div className="data-section">
                        <h2>📅 Tabel Reservasi</h2>
                        {renderTable(data?.data?.reservations, reservationColumns)}
                    </div>
                )}

                {(activeTab === 'all' || activeTab === 'events') && (
                    <div className="data-section">
                        <h2>🎉 Tabel Events</h2>
                        {renderTable(data?.data?.events, eventColumns)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DatabaseViewer;
