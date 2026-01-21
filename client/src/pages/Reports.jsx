import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


export default function Reports() {
  // State untuk Filter
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportType, setReportType] = useState('revenue'); // revenue, occupancy
  
  // State Data Dummy
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalTx: 0, successRate: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // 1. GENERATE DATA DUMMY (Simulasi Backend)
  useEffect(() => {
    // Kita set default tanggal hari ini
    const today = new Date().toISOString().split('T')[0];
    setDateRange({ start: '2024-01-01', end: today });
    
    fetchReportData();
  }, []);

  const fetchReportData = () => {
    setIsLoading(true);
    
    // Simulasi loading data
    setTimeout(() => {
      const mockData = [
        { id: 'INV-001', date: '2024-01-05', user: 'Budi Santoso', item: 'Lapangan A (2 Jam)', amount: 150000, status: 'Lunas' },
        { id: 'INV-002', date: '2024-01-06', user: 'Siti Aminah', item: 'Lapangan B (1 Jam)', amount: 75000, status: 'Lunas' },
        { id: 'INV-003', date: '2024-01-07', user: 'Rahmat Hidayat', item: 'Event Turnamen', amount: 500000, status: 'Pending' },
        { id: 'INV-004', date: '2024-01-08', user: 'Joko Anwar', item: 'Lapangan A (3 Jam)', amount: 225000, status: 'Lunas' },
        { id: 'INV-005', date: '2024-01-09', user: 'Club Padel Jaya', item: 'Member Bulanan', amount: 1200000, status: 'Lunas' },
      ];

      setTransactions(mockData);
      setSummary({
        totalIncome: 2150000,
        totalTx: 5,
        successRate: 80
      });
      setIsLoading(false);
    }, 800);
  };

  // 2. HANDLE EXPORT (Simulasi Download)
  const handleExport = (format) => {
    Swal.fire({
      title: `Mengunduh ${format}...`,
      html: 'Sedang menyiapkan data laporan.',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Laporan periode ${dateRange.start} s/d ${dateRange.end} berhasil diunduh.`,
      });
    });
  };

  // Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="p-4">
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Laporan & Statistik</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Pantau performa bisnis dan arus kas.</p>
        </div>
        
        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => handleExport('Excel')}
            style={{ 
              backgroundColor: '#10b981', color: 'white', padding: '10px 20px', 
              border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
            }}
          >
            📊 Export Excel
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            style={{ 
              backgroundColor: '#ef4444', color: 'white', padding: '10px 20px', 
              border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
            }}
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '25px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Dari Tanggal</label>
          <input 
            type="date" 
            value={dateRange.start} 
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Sampai Tanggal</label>
          <input 
            type="date" 
            value={dateRange.end} 
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Jenis Laporan</label>
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
            style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}
          >
            <option value="revenue">💰 Pemasukan (Revenue)</option>
            <option value="occupancy">📅 Okupansi Lapangan</option>
            <option value="users">busts Pertumbuhan User</option>
          </select>
        </div>

        <button 
          onClick={fetchReportData}
          style={{ 
            padding: '11px 25px', backgroundColor: '#2563eb', color: 'white', 
            border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', height: '46px'
          }}
        >
          Terapkan Filter
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Card 1 */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #2563eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>TOTAL PEMASUKAN</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginTop: '5px' }}>
            {isLoading ? '...' : formatRupiah(summary.totalIncome)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '5px' }}>▲ 12% dari bulan lalu</div>
        </div>

        {/* Card 2 */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #fbbf24', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>TOTAL TRANSAKSI</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginTop: '5px' }}>
            {isLoading ? '...' : summary.totalTx}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>5 Transaksi sukses</div>
        </div>

        {/* Card 3 */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #10b981', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>SUCCESS RATE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginTop: '5px' }}>
            {isLoading ? '...' : `${summary.successRate}%`}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>Transaksi berhasil dibayar</div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>Rincian Transaksi</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left', color: '#475569', fontSize: '0.9rem' }}>No. Invoice</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#475569', fontSize: '0.9rem' }}>Tanggal</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#475569', fontSize: '0.9rem' }}>Pelanggan</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#475569', fontSize: '0.9rem' }}>Item / Layanan</th>
                <th style={{ padding: '15px', textAlign: 'right', color: '#475569', fontSize: '0.9rem' }}>Jumlah (Rp)</th>
                <th style={{ padding: '15px', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center' }}>Memuat data...</td></tr>
              ) : (
                transactions.map((trx, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px', fontWeight: '600', color: '#2563eb' }}>{trx.id}</td>
                    <td style={{ padding: '15px', color: '#475569' }}>{trx.date}</td>
                    <td style={{ padding: '15px', color: '#1e293b' }}>{trx.user}</td>
                    <td style={{ padding: '15px', color: '#475569' }}>{trx.item}</td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>{formatRupiah(trx.amount)}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: trx.status === 'Lunas' ? '#dcfce7' : '#fef3c7',
                        color: trx.status === 'Lunas' ? '#166534' : '#d97706',
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'
                      }}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div style={{ padding: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8fafc' }}>
          <button disabled style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#94a3b8' }}>&lt; Prev</button>
          <button style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #2563eb', background: '#2563eb', color: 'white' }}>1</button>
          <button style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white' }}>2</button>
          <button style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white' }}>Next &gt;</button>
        </div>
      </div>

    </div>
  );
}