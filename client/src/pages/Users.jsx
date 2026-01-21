import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Users() {
  const [admins, setAdmins] = useState([])
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("http://localhost:4000/api/users")
      .then(res => {
        // Filter users by role
        const adminUsers = res.data.filter(u => u.role === 'admin')
        const ownerUsers = res.data.filter(u => u.role === 'owner')
        setAdmins(adminUsers)
        setOwners(ownerUsers)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching users:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <h1 className="page-title">Admins & Owners</h1>

      <section className="section" style={{ marginBottom: 30 }}>
        <h2>Administrators ({admins.length})</h2>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : admins.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: 10, textAlign: 'left' }}>Name</th>
                <th style={{ padding: 10, textAlign: 'left' }}>Email</th>
                <th style={{ padding: 10, textAlign: 'left' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 10 }}>{user.name}</td>
                  <td style={{ padding: 10 }}>{user.email}</td>
                  <td style={{ padding: 10, color: 'var(--primary-blue)', fontWeight: 'bold' }}>Admin</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No administrators found.</p>
        )}
      </section>

      <section className="section">
        <h2>Owners ({owners.length})</h2>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : owners.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: 10, textAlign: 'left' }}>Name</th>
                <th style={{ padding: 10, textAlign: 'left' }}>Email</th>
                <th style={{ padding: 10, textAlign: 'left' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {owners.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 10 }}>{user.name}</td>
                  <td style={{ padding: 10 }}>{user.email}</td>
                  <td style={{ padding: 10, color: 'var(--accent-yellow)', fontWeight: 'bold' }}>Owner</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No owners found.</p>
        )}
      </section>
    </div>
  )
}
