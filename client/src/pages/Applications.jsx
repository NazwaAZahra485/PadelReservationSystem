import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All'); // All, Pending, Approved, Rejected
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk Modal Detail
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // 1. DATA DUMMY
  useEffect(() => {
    // Simulasi fetch data
    setApplications([
      { 
        id: 1, 
        applicant: 'Budi Santoso', 
        courtName: 'Gor Merdeka', 
        location: 'Jakarta Selatan',
        date: '2024-01-05', 
        status: 'Pending',
        document: 'proposal_gor_merdeka.pdf',
        description: 'Kami memiliki fasilitas 3 lapangan indoor dengan parkir luas.'
      },
      { 
        id: 2, 
        applicant: 'CV. Maju Olahraga', 
        courtName: 'Arena Sport Center', 
        location: 'Bandung',
        date: '2024-01-03', 
        status: 'Approved',
        document: 'legalitas_cv.pdf',
        description: 'Kompleks olahraga terpadu.'
      },
      { 
        id: 3, 
        applicant: 'Rina Gunawan', 
        courtName: 'Rina Badminton Hall', 
        location: 'Surabaya',
        date: '2023-12-28', 
        status: 'Rejected',
        reason: 'Dokumen kepemilikan tanah kurang lengkap.',
        description: 'Lapangan bulutangkis di area perumahan.'
      },
      { 
        id: 4, 
        applicant: 'Dani Firmansyah', 
        courtName: 'Futsal 88', 
        location: 'Yogyakarta',
        date: '2024-01-06', 
        status: 'Pending',
        document: 'scan_ktp_sertifikat.pdf',
        description: 'Ingin bermitra untuk sistem booking online.'
      },
    ]);
  }, []);

  // 2. LOGIC FILTER & SEARCH
  const filteredApps = applications.filter(app => {
    const matchStatus = filterStatus === 'All' ? true : app.status === filterStatus;
    const matchSearch = app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        app.courtName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // 3. ACTIONS (APPROVE / REJECT)
  const handleApprove = (id) => {
    Swal.fire({
      title: 'Setujui Pengajuan?',
      text: "Akun owner akan diaktifkan dan lapangan akan masuk ke sistem.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981', // Hijau
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Setujui!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Update State
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: 'Approved' } : app
        ));
        Swal.fire('Disetujui!', 'Pengajuan owner telah diterima.', 'success');
        setShowDetailModal(false);
      }
    });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: 'Tolak Pengajuan',
      input: 'text',
      inputLabel: 'Alasan Penolakan',
      inputPlaceholder: 'Contoh: Dokumen tidak lengkap...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Merah
      confirmButtonText: 'Tolak',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) {
          return 'Anda harus menuliskan alasan penolakan!'
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: 'Rejected', reason: result.value } : app
        ));
        Swal.fire('Ditolak!', 'Pengajuan telah ditolak.', 'error');
        setShowDetailModal(false);
      }
    });
  };

  const handleViewDetail = (app) => {
    setSelectedApp(app);
    setShowDetailModal(true);
  };

  // Helper Badge Warna
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return { bg: '#fef3c7', text: '#d97706', label: 'Menunggu Review' }; // Kuning
      case 'Approved': return { bg: '#dcfce7', text: '#166534', label: 'Diterima' }; // Hijau
      case 'Rejected': return { bg: '#fee2e2', text: '#dc2626', label: 'Ditolak' }; // Merah
      default: return { bg: '#f1f5f9', text: '#475569', label: status };
    }
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Pengajuan Owner</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Kelola pendaftaran mitra pemilik lapangan.</p>
        </div>
        
        <input 
          type="text" 
          placeholder="🔍 Cari nama / lapangan..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', 
            width: '250px', outline: 'none'
          }}
        />
      </div>

      {/* TABS FILTER */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontWeight: '600', fontSize: '0.9rem',
              backgroundColor: filterStatus === status ? '#2563eb' : 'transparent',
              color: filterStatus === status ? 'white' : '#64748b',
              transition: 'all 0.3s'
            }}
          >
            {status === 'All' ? 'Semua' : status === 'Pending' ? 'Menunggu' : status === 'Approved' ? 'Diterima' : 'Ditolak'}
          </button>
        ))}
      </div>

      {/* TABLE DATA */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left', color: '#475569', fontWeight: '600' }}>Pemohon</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#475569', fontWeight: '600' }}>Nama Lapangan</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#475569', fontWeight: '600' }}>Tanggal Masuk</th>
                <th style={{ padding: '15px', textAlign: 'center', color: '#475569', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center', color: '#475569', fontWeight: '600' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => {
                const badge = getStatusBadge(app.status);
                return (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px', color: '#1e293b', fontWeight: '500' }}>{app.applicant}</td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ color: '#1e293b', fontWeight: '500' }}>{app.courtName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 {app.location}</div>
                    </td>
                    <td style={{ padding: '15px', color: '#475569' }}>{app.date}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: badge.bg, color: badge.text, 
                        padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600'
                      }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleViewDetail(app)}
                        style={{ padding: '8px 12px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    Tidak ada data pengajuan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DETAIL --- */}
      {showDetailModal && selectedApp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Detail Pengajuan</h2>
              <button onClick={() => setShowDetailModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>PEMOHON</label>
                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{selectedApp.applicant}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>NAMA & LOKASI LAPANGAN</label>
                <div style={{ fontSize: '1rem' }}>{selectedApp.courtName} - {selectedApp.location}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>DESKRIPSI SINGKAT</label>
                <div style={{ fontSize: '0.95rem', color: '#334155', background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                  {selectedApp.description}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>DOKUMEN PENDUKUNG</label>
                <div style={{ fontSize: '0.95rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>
                  📄 {selectedApp.document}
                </div>
              </div>
              
              {/* Jika Rejected, tampilkan alasannya */}
              {selectedApp.status === 'Rejected' && (
                <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '6px', border: '1px solid #fecaca' }}>
                  <label style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: '600' }}>ALASAN PENOLAKAN</label>
                  <div style={{ color: '#ef4444' }}>{selectedApp.reason}</div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS (Hanya muncul jika status PENDING) */}
            {selectedApp.status === 'Pending' ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleReject(selectedApp.id)}
                  style={{ flex: 1, padding: '12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✖ Tolak
                </button>
                <button 
                  onClick={() => handleApprove(selectedApp.id)}
                  style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✔ Setujui
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px', background: '#f1f5f9', borderRadius: '8px', color: '#64748b' }}>
                Pengajuan ini sudah diproses ({selectedApp.status}).
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}