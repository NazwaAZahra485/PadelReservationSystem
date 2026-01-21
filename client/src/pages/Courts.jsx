import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// --- KOMPONEN KECIL: CARD DENGAN CAROUSEL ---
// Kita pisahkan ini agar setiap card punya state slider sendiri-sendiri
const CourtCard = ({ court, onEdit, onDelete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Pastikan images adalah array, jika tidak (data lama), jadikan array
  const images = Array.isArray(court.images) && court.images.length > 0 
    ? court.images 
    : ['https://via.placeholder.com/400x200?text=No+Image'];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* BAGIAN GAMBAR / CAROUSEL */}
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#e2e8f0' }}>
        <img 
          src={images[currentSlide]} 
          alt={court.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s' }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Error'; }} 
        />
        
        {/* Tombol Panah (Hanya muncul jika gambar > 1) */}
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
            
            {/* Indikator Titik (Dots) */}
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

        {/* Badge Tipe */}
        <span style={{ 
          position: 'absolute', top: '10px', right: '10px', 
          fontSize: '12px', padding: '6px 12px', borderRadius: '20px',
          backgroundColor: court.type === 'Indoor' ? '#2563eb' : '#fbbf24',
          color: court.type === 'Indoor' ? 'white' : '#0f172a',
          fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {court.type}
        </span>
      </div>

      {/* BAGIAN KONTEN */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '5px' }}>{court.name}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', color: '#64748b', fontSize: '0.9rem' }}>
          <span>📍</span> {court.location || 'Lokasi tidak tersedia'}
        </div>

        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '15px', flex: 1 }}>
          {court.description || 'Tidak ada deskripsi.'}
        </p>

        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '20px' }}>
          Rp {parseInt(court.price).toLocaleString('id-ID')} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#94a3b8' }}>/ Jam</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onEdit(court)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', color: '#334155', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
          <button onClick={() => onDelete(court.id)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontWeight: '600' }}>Hapus</button>
        </div>
      </div>
    </div>
  );
};


// --- KOMPONEN UTAMA ---
export default function Courts() {
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Data Form
  const [formData, setFormData] = useState({
    name: '', type: 'Indoor', price: '', location: '', description: '',
    images: [] // Array untuk menyimpan URL gambar
  });
  
  // State khusus untuk preview file yang baru diupload
  const [previewFiles, setPreviewFiles] = useState([]); 

  // 1. READ DATA
  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = () => {
    axios.get("http://localhost:4000/api/courts")
      .then(res => {
        setCourts(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        // DATA DUMMY DENGAN MULTIPLE IMAGES
        setCourts([
          { 
            id: 1, name: 'Padel Arena A', type: 'Indoor', price: 200000, 
            location: 'Lantai 1, Sayap Kiri',
            description: 'Lapangan rumput sintetis standar internasional.',
            images: [
              'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1626224583764-847890e058f5?q=80&w=1000&auto=format&fit=crop'
            ]
          },
          { 
            id: 2, name: 'Tennis Court B', type: 'Outdoor', price: 150000, 
            location: 'Area Taman Belakang',
            description: 'Lapangan outdoor dengan suasana asri.',
            images: [
              'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1000&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop'
            ]
          },
        ]);
        setIsLoading(false);
      });
  };

  // --- LOGIC UPLOAD FILE ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Batasi maks 5 file
    if (files.length > 5) {
      alert("Maksimal upload 5 foto!");
      return;
    }

    // Buat URL Preview sementara (blob:http://...)
    // Ini agar gambar bisa tampil di frontend tanpa harus upload ke server beneran dulu
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    // Simpan ke state
    setPreviewFiles(newPreviewUrls);
    
    // Simpan juga ke formData (biasanya di sini kita simpan File object untuk dikirim ke backend)
    // Tapi untuk demo Frontend-only, kita simpan URL preview-nya saja agar bisa disimpan di state 'courts'
    setFormData({ ...formData, images: newPreviewUrls });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setPreviewFiles([]); // Reset preview
    setFormData({ name: '', type: 'Indoor', price: '', location: '', description: '', images: [] });
    setShowModal(true);
  };

  const openEditModal = (court) => {
    setIsEditing(true);
    setCurrentId(court.id);
    setPreviewFiles([]); // Reset preview baru
    // Pastikan images ada array
    const existingImages = Array.isArray(court.images) ? court.images : [];
    setFormData({ 
      name: court.name, type: court.type, price: court.price,
      location: court.location || '', description: court.description || '', 
      images: existingImages
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Gunakan gambar yang ada di form (entah itu baru upload atau lama)
    const finalImages = formData.images.length > 0 
      ? formData.images 
      : ['https://via.placeholder.com/400x200?text=No+Image'];

    const dataToSave = { ...formData, images: finalImages };

    // Simulasi API Call
    const apiCall = isEditing 
      ? axios.put(`http://localhost:4000/api/courts/${currentId}`, dataToSave)
      : axios.post("http://localhost:4000/api/courts", dataToSave);

    apiCall
      .then(() => {
        fetchCourts();
        Swal.fire({
          icon: 'success', title: 'Berhasil!',
          text: 'Data berhasil disimpan.', confirmButtonColor: '#2563eb'
        });
      })
      .catch(() => {
        // FALLBACK DEMO FRONTEND
        if(isEditing) {
            setCourts(courts.map(c => c.id === currentId ? { ...c, ...dataToSave } : c));
        } else {
            setCourts([...courts, { id: Date.now(), ...dataToSave }]);
        }
        Swal.fire({
          icon: 'success', title: 'Tersimpan (Lokal)',
          text: 'Foto berhasil diupload secara lokal.', confirmButtonColor: '#2563eb'
        });
      });
      
    setShowModal(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus lapangan?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', confirmButtonText: 'Hapus', cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:4000/api/courts/${id}`)
          .then(() => fetchCourts())
          .catch(() => {
            setCourts(courts.filter(c => c.id !== id));
            Swal.fire('Terhapus!', '', 'success');
          });
      }
    })
  };

  return (
    <div className="p-4">
      {/* HEADER & SEARCH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Management Lapangan</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" placeholder="🔍 Cari nama..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '250px', outline: 'none' }}
          />
          <button onClick={openAddModal} style={{ backgroundColor: '#fbbf24', color: '#0f172a', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Tambah
          </button>
        </div>
      </div>

      {/* LIST CARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {courts
          .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((court) => (
            // Panggil Component CourtCard
            <CourtCard 
              key={court.id} 
              court={court} 
              onEdit={openEditModal} 
              onDelete={handleDelete} 
            />
        ))}
      </div>

      {/* --- MODAL FORM --- */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#0f172a' }}>{isEditing ? 'Edit Lapangan' : 'Tambah Lapangan'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Nama</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              {/* INPUT FILE UPLOAD */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Upload Foto (Max 5)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" // Hanya terima file gambar
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }} 
                />
                
                {/* PREVIEW GAMBAR KECIL DI FORM */}
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
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Tipe</label>
                  <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Harga</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Lokasi</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
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