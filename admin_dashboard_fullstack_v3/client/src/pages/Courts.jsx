import React, { useEffect, useState } from 'react'
import Sidebar from '../shared/Sidebar'
import axios from 'axios'

export default function Courts() {
  const [courts, setCourts] = useState([])

  useEffect(() => {
    axios.get("http://localhost:4000/api/courts")
      .then(res => setCourts(res.data))
      .catch(() => setCourts([]))
  }, [])

  return (
    <div className="layout">
     

      <main className="content">
        <h1 className="page-title">Management Lapangan</h1>

        <section className="section">
          <h3>Daftar Lapangan</h3>
          {courts.length > 0 ? (
            <ul>
              {courts.map(court => (
                <li key={court.id}>{court.name} - {court.type}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Data lapangan akan tampil jika backend tersedia.</p>
          )}
        </section>
      </main>
    </div>
  )
}
