import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  // State Data Pengaturan
  const [settings, setSettings] = useState({
    appName: 'Padel Indonesia Manager',
    supportEmail: 'admin@padelindo.id',
    phoneNumber: '0812-3456-7890',
    appLogo: 'https://via.placeholder.com/150', // Dummy Logo
    
    // Bisnis
    taxRate: 11, // PPN dalam %
    platformFee: 5000, // Biaya admin per booking
    enableRefund: true,
    
    // Keamanan
    maintenanceMode: false,
    emailNotifications: true,
    waNotifications: false
  });

  // State Khusus Ganti Password
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Upload Logo (Preview Only)
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSettings(prev => ({ ...prev, appLogo: previewUrl }));
    }
  };

  // Handle Save
  const handleSave = () => {
    setIsLoading(true);
    // Simulasi Loading API
    setTimeout(() => {
      setIsLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Pengaturan Disimpan!',
        text: 'Perubahan telah diterapkan pada sistem.',
        confirmButtonColor: '#2563eb'
      });
    }, 1000);
  };

  // --- RENDER TAB CONTENT ---

  // 1. Tab Umum
  const renderGeneral = () => (
    <div style={styles.formSection}>
      <h3 style={styles.sectionTitle}>Identitas Aplikasi</h3>
      
      {/* Upload Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <img src={settings.appLogo} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
        <div>
          <label style={{ ...styles.btnSecondary, display: 'inline-block', cursor: 'pointer' }}>
            Upload Logo Baru
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
          </label>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>Rekomen: 500x500px, PNG/JPG.</p>
        </div>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Nama Aplikasi</label>
        <input type="text" name="appName" value={settings.appName} onChange={handleChange} style={styles.input} />
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ ...styles.inputGroup, flex: 1 }}>
          <label style={styles.label}>Email Support</label>
          <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} style={styles.input} />
        </div>
        <div style={{ ...styles.inputGroup, flex: 1 }}>
          <label style={styles.label}>Nomor WhatsApp Admin</label>
          <input type="text" name="phoneNumber" value={settings.phoneNumber} onChange={handleChange} style={styles.input} />
        </div>
      </div>
    </div>
  );

  // 2. Tab Bisnis
  const renderBusiness = () => (
    <div style={styles.formSection}>
      <h3 style={styles.sectionTitle}>Keuangan & Transaksi</h3>
      <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>Atur biaya tambahan yang dibebankan kepada user.</p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Pajak (PPN) %</label>
          <input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} style={styles.input} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Biaya Platform (Rp)</label>
          <input type="number" name="platformFee" value={settings.platformFee} onChange={handleChange} style={styles.input} />
        </div>
      </div>

      <h3 style={styles.sectionTitle}>Kebijakan Pembatalan</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div>
          <div style={{ fontWeight: '600', color: '#1e293b' }}>Izinkan Refund</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>User bisa membatalkan booking max H-1.</div>
        </div>
        <label className="switch">
          <input type="checkbox" name="enableRefund" checked={settings.enableRefund} onChange={handleChange} />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );

  // 3. Tab Keamanan
  const renderSecurity = () => (
    <div style={styles.formSection}>
      <h3 style={styles.sectionTitle}>Ganti Password Admin</h3>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Password Lama</label>
        <input type="password" style={styles.input} placeholder="••••••••" />
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Password Baru</label>
          <input type="password" style={styles.input} placeholder="••••••••" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Konfirmasi Password</label>
          <input type="password" style={styles.input} placeholder="••••••••" />
        </div>
      </div>
      <button style={{ ...styles.btnSecondary, marginTop: '10px' }} onClick={() => Swal.fire('Info', 'Fitur ganti password backend belum aktif.', 'info')}>
        Update Password
      </button>

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

      <h3 style={{ ...styles.sectionTitle, color: '#dc2626' }}>Zona Bahaya</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
        <div>
          <div style={{ fontWeight: '600', color: '#991b1b' }}>Maintenance Mode</div>
          <div style={{ fontSize: '0.85rem', color: '#b91c1c' }}>Aplikasi tidak bisa diakses user saat aktif.</div>
        </div>
        <label className="switch">
          <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} />
          <span className="slider round danger"></span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {/* CSS untuk Toggle Switch (Disimpan di dalam komponen agar praktis) */}
      <style>{`
        .switch { position: relative; display: inline-block; width: 50px; height: 26px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #2563eb; }
        input:checked + .slider.danger { background-color: #dc2626; }
        input:checked + .slider:before { transform: translateX(24px); }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: '25px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Settings</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Konfigurasi umum aplikasi dan preferensi sistem.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* SIDEBAR NAVIGATION SETTINGS */}
        <div style={{ width: '250px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {[
            { id: 'general', icon: '⚙️', label: 'Umum' },
            { id: 'business', icon: '💰', label: 'Bisnis & Keuangan' },
            { id: 'security', icon: '🔒', label: 'Akun & Keamanan' },
          ].map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '15px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: activeTab === tab.id ? '#eff6ff' : 'white',
                color: activeTab === tab.id ? '#2563eb' : '#475569',
                fontWeight: activeTab === tab.id ? '600' : 'normal',
                borderLeft: activeTab === tab.id ? '4px solid #2563eb' : '4px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </div>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          {activeTab === 'general' && renderGeneral()}
          {activeTab === 'business' && renderBusiness()}
          {activeTab === 'security' && renderSecurity()}

          {/* TOMBOL SAVE GLOBAL */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              style={{ 
                padding: '12px 30px', backgroundColor: '#2563eb', color: 'white', 
                border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '10px'
              }}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// STYLES OBJECT (Agar kode JSX lebih bersih)
const styles = {
  formSection: { animation: 'fadeIn 0.5s' },
  sectionTitle: { fontSize: '1.2rem', color: '#1e293b', marginBottom: '20px', fontWeight: 'bold' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' },
  input: { 
    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', 
    fontSize: '0.95rem', color: '#1e293b', outline: 'none', transition: 'border 0.3s'
  },
  btnSecondary: {
    padding: '10px 15px', backgroundColor: 'white', border: '1px solid #cbd5e1', 
    borderRadius: '6px', cursor: 'pointer', color: '#475569', fontWeight: '600', fontSize: '0.9rem'
  }
};