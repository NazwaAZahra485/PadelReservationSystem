import React, { useEffect, useState } from 'react'
import Sidebar from '../shared/Sidebar'
import axios from 'axios'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get("http://localhost:4000/api/users")
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
  }, [])

  return (
    <div className="layout">

      <main className="content">
        <h1 className="page-title">User Management</h1>

        <section className="section">
          <h3>Daftar User</h3>
          {users.length > 0 ? (
            <ul>
              {users.map(user => (
                <li key={user.id}>{user.name} - {user.email}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Data user akan tampil jika backend tersedia.</p>
          )}
        </section>
      </main>
    </div>
  )
}
