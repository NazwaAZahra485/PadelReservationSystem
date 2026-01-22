import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import Swal from 'sweetalert2';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    images: [] // Array of File objects or URL strings
  });

  // Preview Images State
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await apiFetch('/events');
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Data event bukan array:', data);
        setEvents([]);
      }
    } catch (err) {
      console.error('Gagal ambil data event', err);
      Swal.fire('Error', 'Gagal mengambil data event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ title: '', date: '', location: '', description: '', images: [] });
    setPreviewImages([]);
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setIsEditing(true);
    setCurrentId(event.id);
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location || '',
      description: event.description || '',
      images: event.images || []
    });

    const serverUrl = 'http://localhost:4000';
    const images = Array.isArray(event.images) ? event.images : [];
    const previews = images.map(img => img.startsWith('http') ? img : `${serverUrl}${img}`);
    setPreviewImages(previews);

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('date', formData.date);
      data.append('location', formData.location);
      data.append('description', formData.description);

      const newFiles = [];
      const existingImages = [];

      formData.images.forEach(img => {
        if (img instanceof File) {
          newFiles.push(img);
        } else {
          existingImages.push(img);
        }
      });

      newFiles.forEach(file => {
        data.append('images', file);
      });

      existingImages.forEach(img => {
        data.append('existingImages', img);
      });

      let url = '/events';
      let method = 'POST';

      if (isEditing) {
        url = `/events/${currentId}`;
        method = 'PUT';
      }

      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:4000/api${url}`, {
        method: method,
        headers: headers,
        body: data
      });

      if (!res.ok) throw new Error('Gagal menyimpan data');

      await fetchEvents();
      setShowModal(false);
      Swal.fire('Sukses', `Data berhasil ${isEditing ? 'diupdate' : 'disimpan'}`, 'success');

    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Terjadi kesalahan saat menyimpan data', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Yakin hapus?',
      text: "Data tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiFetch(`/events/${id}`, { method: 'DELETE' });
          fetchEvents();
          Swal.fire('Terhapus!', 'Data event telah dihapus.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Gagal menghapus data', 'error');
        }
      }
    });
  };

  // Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="page-title">Manajemen Event</h1>
        <button className="btn-primary" onClick={openAddModal}>
          + Tambah Event
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="public-grid">
          {events.map(event => (
            <div key={event.id} className="public-card">
              <div className="card-image-container">
                {event.images && event.images.length > 0 ? (
                  <img
                    src={event.images[0].startsWith('http') ? event.images[0] : `http://localhost:4000${event.images[0]}`}
                    alt={event.title}
                    className="card-image"
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#94a3b8' }}>
                    No Image
                  </div>
                )}
                <div className="event-date-badge">
                  {formatDate(event.date)}
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{event.title}</h3>
                <p className="card-location">📍 {event.location || 'Lokasi belum diatur'}</p>
                <p className="card-description">{event.description || 'Tidak ada deskripsi.'}</p>

                <div className="card-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button className="btn-edit" onClick={() => openEditModal(event)} style={{ flex: 1, padding: '10px' }}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(event.id)} style={{ flex: 1, padding: '10px' }}>Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Edit Event' : 'Tambah Event Baru'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Judul Event</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lokasi</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Poster / Foto Event</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {previewImages.map((src, index) => (
                    <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute', top: '-5px', right: '-5px',
                          background: 'red', color: 'white', border: 'none',
                          borderRadius: '50%', width: '20px', height: '20px',
                          cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn-save">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
