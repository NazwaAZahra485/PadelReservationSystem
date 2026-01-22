import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import Swal from 'sweetalert2';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Gagal ambil data user', err);
      Swal.fire('Error', 'Gagal mengambil data user', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">User Management</h1>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: '15px', color: '#64748b' }}>Nama</th>
                <th style={{ padding: '15px', color: '#64748b' }}>Email</th>
                <th style={{ padding: '15px', color: '#64748b' }}>Role</th>
                <th style={{ padding: '15px', color: '#64748b' }}>Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Tidak ada user.</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px', fontWeight: '600', color: '#1e293b' }}>{user.name}</td>
                    <td style={{ padding: '15px', color: '#475569' }}>{user.email}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                        backgroundColor: user.role === 'admin' ? '#dbeafe' : user.role === 'owner' ? '#fef3c7' : '#dcfce7',
                        color: user.role === 'admin' ? '#1e40af' : user.role === 'owner' ? '#92400e' : '#166534'
                      }}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#94a3b8' }}>
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
