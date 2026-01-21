import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// --- KOMPONEN KECIL: CARD EVENT DENGAN CAROUSEL ---
const EventCard = ({ event, onEdit, onDelete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Pastikan images adalah array
  const images = Array.isArray(event.images) && event.images.length > 0 
    ? event.images 
    : ['https://via.placeholder.com/400x250?text=No+Event+Poster'];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Format Tanggal biar cantik (contoh: 12 Januari 2024)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* BAGIAN GAMBAR / CAROUSEL */}
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#e2e8f0' }}>
        <img 
          src={images[currentSlide]} 
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s' }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Error'; }} 
        />
        
        {/* Tombol Navigasi Gambar (Jika lebih dari 1) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              style={{
                position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%',
                width: '30px', height: '30px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              &#8249;
            </button>
            <button 
              onClick={nextSlide}
              style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%',
                width: '30px', height: '30px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              &#8250;
            </button>
            
            {/* Indikator Titik */}
            <div style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '5px' }}>
              {images.map((_, idx) => (
                <div 
                  key={idx}
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: currentSlide === idx ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                    transition: 'background 0.3s'
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Badge Tanggal (Di pojok atas) */}
        <span style={{ 
          position: 'absolute', top: '10px', right: '10px', 
          fontSize: '12px', padding: '6px 12px', borderRadius: '20px',
          backgroundColor: '#fbbf24', color: '#0f172a',
          fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          📅 {formatDate(event.date)}
        </span>
      </div>

      {/* BAGIAN KONTEN */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '5px' }}>{event.title}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', color: '#64748b', fontSize: '0.9rem' }}>
          <span>📍</span> {event.location || 'Lokasi belum diatur'}
        </div>

        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '15px', flex: 1 }}>
          {event.description || 'Tidak ada deskripsi event.'}
        </p>

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button onClick={() => onEdit(event)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', color: '#334155', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
          <button onClick={() => onDelete(event.id)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontWeight: '600' }}>Hapus</button>
        </div>
      </div>
    </div>
  );
};


// --- KOMPONEN UTAMA HALAMAN EVENTS ---
export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Data Form
  const [formData, setFormData] = useState({
    title: '', date: '', location: '', description: '',
    images: [] 
  });
  
  // Preview File Upload
  const [previewFiles, setPreviewFiles] = useState([]); 

  // 1. READ DATA
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get("http://localhost:4000/api/events")
      .then(res => {
        setEvents(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        // DATA DUMMY JIKA BACKEND MATI
        setEvents([
          { 
            id: 1, title: 'Turnamen Padel Nasional 2024', date: '2024-05-15', 
            location: 'Main Hall',
            description: 'Kompetisi padel terbesar tahun ini diikuti oleh atlet profesional.',
            images: ['https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop']
          },
          { 
            id: 2, title: 'Fun Match Weekend', date: '2024-06-10', 
            location: 'Lapangan Outdoor',
            description: 'Ajang kumpul komunitas pecinta padel setiap akhir pekan.',
            images: ['https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop']
          },
        ]);
        setIsLoading(false);
      });
  };

  // --- LOGIC UPLOAD FILE (Sama persis dengan Courts) ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert("Maksimal upload 5 poster/foto!");
      return;
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewFiles(newPreviewUrls);
    setFormData({ ...formData, images: newPreviewUrls });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setPreviewFiles([]); 
    setFormData({ title: '', date: '', location: '', description: '', images: [] });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setIsEditing(true);
    setCurrentId(event.id);
    setPreviewFiles([]); 
    const existingImages = Array.isArray(event.images) ? event.images : [];
    setFormData({ 
      title: event.title, date: event.date || '',
      location: event.location || '', description: event.description || '', 
      images: existingImages
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalImages = formData.images.length > 0 
      ? formData.images 
      : ['https://via.placeholder.com/400x250?text=No+Poster'];

    const dataToSave = { ...formData, images: finalImages };

    const apiCall = isEditing 
      ? axios.put(`http://localhost:4000/api/events/${currentId}`, dataToSave)
      : axios.post("http://localhost:4000/api/events", dataToSave);

    apiCall
      .then(() => {
        fetchEvents();
        Swal.fire({
          icon: 'success', title: 'Berhasil!',
          text: 'Data event berhasil disimpan.', confirmButtonColor: '#2563eb'
        });
      })
      .catch(() => {
        // FALLBACK DEMO
        if(isEditing) {
            setEvents(events.map(e => e.id === currentId ? { ...e, ...dataToSave } : e));
        } else {
            setEvents([...events, { id: Date.now(), ...dataToSave }]);
        }
        Swal.fire({
          icon: 'success', title: 'Tersimpan (Demo)',
          text: 'Event berhasil ditambahkan (Frontend Only).', confirmButtonColor: '#2563eb'
        });
      });
      
    setShowModal(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Event?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', confirmButtonText: 'Hapus', cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:4000/api/events/${id}`)
          .then(() => fetchEvents())
          .catch(() => {
            setEvents(events.filter(e => e.id !== id));
            Swal.fire('Terhapus!', 'Event telah dihapus.', 'success');
          });
      }
    })
  };

  return (
    <div className="p-4">
      {/* HEADER & SEARCH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Management Event</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" placeholder="🔍 Cari event..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '250px', outline: 'none' }}
          />
          <button onClick={openAddModal} style={{ backgroundColor: '#fbbf24', color: '#0f172a', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Tambah Event
          </button>
        </div>
      </div>

      {/* LIST CARD EVENT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {events
          .filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={openEditModal} 
              onDelete={handleDelete} 
            />
        ))}
      </div>
      
      {/* Pesan Kosong */}
      {events.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 mt-10">Belum ada event yang terdaftar.</p>
      )}

      {/* --- MODAL FORM --- */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#0f172a' }}>{isEditing ? 'Edit Event' : 'Tambah Event Baru'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Nama Event</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Contoh: Turnamen Akhir Tahun" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              {/* INPUT FILE UPLOAD */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Poster / Foto</label>
                <input 
                  type="file" multiple accept="image/*" 
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }} 
                />
                
                {formData.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '5px', marginTop: '10px', overflowX: 'auto' }}>
                    {formData.images.map((img, idx) => (
                      <img key={idx} src={img} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Tanggal</label>
                  <input type="date" name="date" required value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Lokasi</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Contoh: Lapangan Utama" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Deskripsi</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}