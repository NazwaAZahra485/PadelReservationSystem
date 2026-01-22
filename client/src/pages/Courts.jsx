import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const CourtCard = ({ court, onEdit, onDelete, onBook, userRole, currentUser }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
      
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#e2e8f0' }}>
        <img 
          src={images[currentSlide]} 
          alt={court.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s' }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Error'; }} 
        />
        
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

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '5px' }}>{court.name}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', color: '#64748b', fontSize: '0.9rem' }}>
          <span></span> {court.location || 'Lokasi tidak tersedia'}
        </div>

        {court.owner && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', color: '#059669', fontSize: '0.9rem' }}>
            <span></span> Owner: {court.owner.name}
          </div>
        )}

        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '15px', flex: 1 }}>
          {court.description || 'Tidak ada deskripsi.'}
        </p>

        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '20px' }}>
          Rp {parseInt(court.price).toLocaleString('id-ID')} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#94a3b8' }}>/ Jam</span>
        </div>

        {court.maintenance && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '15px',
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            🔧 Under Maintenance - Not Available for Booking
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          {(userRole === 'admin' || (userRole === 'owner' && court.ownerId === currentUser?.id)) ? (
            <>
              <button onClick={() => onEdit(court)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', color: '#334155', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
              <button onClick={() => onDelete(court.id)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontWeight: '600' }}>Hapus</button>
            </>
          ) : (
            <button 
              onClick={() => onBook(court)} 
              disabled={court.maintenance}
              style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '6px', 
                border: 'none', 
                background: court.maintenance ? '#cbd5e1' : '#2563eb', 
                color: court.maintenance ? '#64748b' : 'white', 
                cursor: court.maintenance ? 'not-allowed' : 'pointer', 
                fontWeight: '600' 
              }}
            >
              {court.maintenance ? 'Under Maintenance' : 'Book Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Courts() {
  const location = useLocation();
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [owners, setOwners] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Determine page mode based on route
  const getPageMode = () => {
    if (location.pathname === '/courts') return 'public';
    if (location.pathname === '/admin/courts') return 'admin';
    if (location.pathname === '/owner/courts') return 'owner';
    return 'public';
  };

  const pageMode = getPageMode();

  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Data Form
  const [formData, setFormData] = useState({
    name: '', type: 'Indoor', price: '', location: '', description: '',
    images: [], 
    maintenance: false, 
    ownerId: '' 
  });
  
  const [previewFiles, setPreviewFiles] = useState([]); 

  // 1. READ DATA
  useEffect(() => {
    fetchCourts();
    fetchOwners();
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setCurrentUser(user);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  };

  const fetchOwners = () => {
    axios.get("http://localhost:4000/api/users")
      .then(res => {
       
        const ownerUsers = res.data.filter(user => user.role === 'owner');
        setOwners(ownerUsers);
      })
      .catch(err => {
        console.error('Error fetching owners:', err);
        
        setOwners([
          { id: 1, name: 'John Owner', email: 'john@example.com', role: 'owner' },
          { id: 2, name: 'Jane Owner', email: 'jane@example.com', role: 'owner' }
        ]);
      });
  };

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert("Maksimal upload 5 foto!");
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
    setPreviewFiles([]); // Reset preview
    setFormData({ 
      name: '', type: 'Indoor', price: '', location: '', description: '', 
      images: [], maintenance: false, ownerId: '' 
    });
    setShowModal(true);
  };

  const openEditModal = (court) => {
    setIsEditing(true);
    setCurrentId(court.id);
    setPreviewFiles([]);
    const existingImages = Array.isArray(court.images) ? court.images : [];
    setFormData({ 
      name: court.name, type: court.type, price: court.price,
      location: court.location || '', description: court.description || '', 
      images: existingImages,
      maintenance: court.maintenance || false,
      ownerId: court.ownerId || court.owner?.id || ''
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

  const handleBook = (court) => {
    // Navigate to booking page with selected court
    window.location.href = `/booking?court=${court.id}`;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          {pageMode === 'admin' ? 'Management Lapangan' : 
           pageMode === 'owner' ? 'My Courts' : 
           'Available Courts'}
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" placeholder=" Cari nama..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '250px', outline: 'none' }}
          />
          {pageMode === 'admin' && (
            <button onClick={openAddModal} style={{ backgroundColor: '#fbbf24', color: '#0f172a', padding: '10px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + Tambah
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {courts
          .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((court) => (
            <CourtCard 
              key={court.id} 
              court={court} 
              onEdit={openEditModal} 
              onDelete={handleDelete}
              onBook={handleBook}
              userRole={pageMode === 'public' ? '' : pageMode}
              currentUser={currentUser}
            />
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#0f172a' }}>{isEditing ? 'Edit Lapangan' : 'Tambah Lapangan'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Nama</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Upload Foto (Max 5)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
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

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="maintenance"
                    checked={formData.maintenance}
                    onChange={(e) => setFormData({ ...formData, maintenance: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Under Maintenance
                </label>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  If checked, this court cannot be reserved by customers.
                </p>
              </div>

              {currentUser && currentUser.role === 'admin' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Assign to Owner</label>
                  <select 
                    name="ownerId" 
                    value={formData.ownerId} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="">Select Owner (Optional)</option>
                    {owners.map(owner => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Assign this court to a specific owner. Leave empty for admin-only management.
                  </p>
                </div>
              )}

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