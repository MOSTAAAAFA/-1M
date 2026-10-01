import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import API_BASE from '../utils/api';

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    condition: 'new',
    status: 'available',
    description: '',
    images: [],
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCars(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editingCar
      ? `${API_BASE}/products/${editingCar._id}`
      : `${API_BASE}/products`;

    const method = editingCar ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingCar ? 'Car updated successfully!' : 'Car added successfully!');
        setShowModal(false);
        resetForm();
        fetchCars();
      } else {
        alert('Failed to save car');
      }
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Error saving car');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Car deleted successfully!');
        fetchCars();
      } else {
        alert('Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car');
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name || '',
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || '',
      price: car.price || '',
      mileage: car.mileage || 0,
      condition: car.condition || 'new',
      status: car.status || 'available',
      description: car.description || '',
      images: car.images || [],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCar(null);
    setFormData({
      name: '',
      brand: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      condition: 'new',
      status: 'available',
      description: '',
      images: [],
    });
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || car.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = filteredCars.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 60,
                height: 60,
                border: '4px solid rgba(201,168,76,0.2)',
                borderTop: '4px solid var(--gold)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}/>
              <p style={{ color: 'var(--gold)', fontSize: 14 }}>LOADING CARS...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        {/* Header */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
              Cars Management
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Manage your car inventory
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
              border: 'none',
              borderRadius: '10px',
              color: '#000',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(201,168,76,0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(201,168,76,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(201,168,76,0.3)';
            }}
          >
            ➕ ADD NEW CAR
          </button>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: 250,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              color: '#fff',
              fontSize: 14,
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>

        {/* Cars Table */}
        <div style={{
          background: 'rgba(17,17,23,0.6)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>CAR</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>YEAR</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>PRICE</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>STATUS</th>
                <th style={{ padding: '16px', textAlign: 'center', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCars.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                    No cars found
                  </td>
                </tr>
              ) : (
                paginatedCars.map((car) => (
                  <tr key={car._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 60,
                          height: 60,
                          background: 'rgba(201,168,76,0.1)',
                          borderRadius: '20px',
                          overflow: 'hidden',
                        }}>
                          {car.images?.[0] ? (
                            <img src={car.images[0]} alt={car.name} onError={(e) => { e.currentTarget.src = `https://placehold.co/400x300/111117/C9A84C?text=${encodeURIComponent(car.name)}`; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 17H3v-6l2-5h14l2 5v6h-2" />
                                <path d="M3 17h18" />
                                <circle cx="7.5" cy="17.5" r="2.5" />
                                <circle cx="16.5" cy="17.5" r="2.5" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>{car.name}</p>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>{car.brand} {car.model}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#fff' }}>{car.year}</td>
                    <td style={{ padding: '16px', color: '#fff', fontWeight: 600 }}>${car.price?.toLocaleString()}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background: car.status === 'available' ? 'rgba(34,197,94,0.1)' : car.status === 'sold' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
                        color: car.status === 'available' ? '#22c55e' : car.status === 'sold' ? '#ef4444' : '#fbbf24',
                        border: `1px solid ${car.status === 'available' ? 'rgba(34,197,94,0.3)' : car.status === 'sold' ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'}`,
                      }}>
                        {car.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(car)}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(59,130,246,0.1)',
                          border: '1px solid rgba(59,130,246,0.3)',
                          borderRadius: '6px',
                          color: '#3b82f6',
                          fontSize: 12,
                          cursor: 'pointer',
                          marginRight: 8,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '6px',
                          color: '#ef4444',
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '6px',
                color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : '#fff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span style={{ padding: '8px 16px', color: '#fff' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                background: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '6px',
                color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : '#fff',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(17,17,23,0.98)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '16px',
                padding: 32,
                maxWidth: 600,
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ fontSize: 24, fontWeight: 600, color: '#fff', marginBottom: 24 }}>
                {editingCar ? 'Edit Car' : 'Add New Car'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: 16 }}>
                  <input
                    type="text"
                    placeholder="Car Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      color: '#fff',
                      fontSize: 14,
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <input
                      type="text"
                      placeholder="Brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      required
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        color: '#fff',
                        fontSize: 14,
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Model"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      required
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        color: '#fff',
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <input
                      type="number"
                      placeholder="Year"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      required
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        color: '#fff',
                        fontSize: 14,
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        color: '#fff',
                        fontSize: 14,
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Mileage"
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        color: '#fff',
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value})}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        color: '#fff',
                        fontSize: 14,
                      }}
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="certified">Certified Pre-Owned</option>
                    </select>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        color: '#fff',
                        fontSize: 14,
                      }}
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      color: '#fff',
                      fontSize: 14,
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      color: '#fff',
                      fontSize: 14,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
                      border: 'none',
                      borderRadius: '20px',
                      color: '#000',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {editingCar ? 'Update Car' : 'Add Car'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
