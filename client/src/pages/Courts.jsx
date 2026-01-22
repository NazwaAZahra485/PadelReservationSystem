import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import Swal from 'sweetalert2';

export default function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'Indoor',
    price: '',
    description: '',
    images: [] // Array of File objects or URL strings
  });

  // Preview Images State
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const res = await apiFetch('/courts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCourts(data);
      } else {
        console.error('Data courts bukan array:', data);
        setCourts([]);
      }
    } catch (err) {
      console.error('Gagal ambil data lapangan', err);
      Swal.fire('Error', 'Gagal mengambil data lapangan', 'error');
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
    setFormData({ name: '', location: '', type: 'Indoor', price: '', description: '', images: [] });
    setPreviewImages([]);
    setShowModal(true);
  };

  const openEditModal = (court) => {
    setIsEditing(true);
    setCurrentId(court.id);
    setFormData({
      name: court.name,
      location: court.location,
      type: court.type,
      price: court.price,
      description: court.description || '',
      images: court.images || []
    });

    const serverUrl = 'http://localhost:4000';
    const images = Array.isArray(court.images) ? court.images : [];
    const previews = images.map(img => img.startsWith('http') ? img : `${serverUrl}${img}`);
    setPreviewImages(previews);

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('location', formData.location);
      data.append('type', formData.type);
      data.append('price', formData.price);
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

      let url = '/courts';
      let method = 'POST';

      if (isEditing) {
        url = `/courts/${currentId}`;
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

      await fetchCourts();
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
          await apiFetch(`/courts/${id}`, { method: 'DELETE' });
          fetchCourts();
          Swal.fire('Terhapus!', 'Data lapangan telah dihapus.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Gagal menghapus data', 'error');
        }
      }
    });
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="page-title">Manajemen Lapangan</h1>
        <button className="btn-primary" onClick={openAddModal}>
          + Tambah Lapangan
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="public-grid">
          {courts.map(court => (
            <div key={court.id} className="public-card">
              <div className="card-image-container">
                {court.images && court.images.length > 0 ? (
                  <img
                    src={court.images[0].startsWith('http') ? court.images[0] : `http://localhost:4000${court.images[0]}`}
                    alt={court.name}
                    className="card-image"
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#94a3b8' }}>
                    No Image
                  </div>
                )}
                <div className="card-badge">{court.type}</div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{court.name}</h3>
                <p className="card-location">📍 {court.location}</p>
                <p className="card-description">{court.description || 'Tidak ada deskripsi.'}</p>

                <div className="card-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                  <div className="price-tag">
                    <span className="currency">Rp</span>
                    <span className="amount">{Number(court.price || 0).toLocaleString('id-ID')}</span>
                    <span className="period">/ jam</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-edit" onClick={() => openEditModal(court)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(court.id)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>Hapus</button>
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
            <h2>{isEditing ? 'Edit Lapangan' : 'Tambah Lapangan Baru'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Lapangan</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lokasi (Lantai/Area)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipe Lapangan</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>

              <div className="form-group">
                <label>Harga per Jam (Rp)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
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
                <label>Foto Lapangan</label>
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
