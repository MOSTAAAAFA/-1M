import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import API_BASE from '../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('User deleted successfully!');
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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
              <p style={{ color: 'var(--gold)', fontSize: 14 }}>LOADING USERS...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
            Users Management
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Manage registered users
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{
            padding: '20px',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>Total Users</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)', margin: 0 }}>{users.length}</p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>Active Users</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#22c55e', margin: 0 }}>
              {users.filter(u => u.isActive !== false).length}
            </p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>Admins</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6', margin: 0 }}>
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 500,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              color: '#fff',
              fontSize: 14,
            }}
          />
        </div>

        {/* Users Table */}
        <div style={{
          background: 'rgba(17,17,23,0.6)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600 }}>USER</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600 }}>EMAIL</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600 }}>ROLE</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600 }}>JOINED</th>
                <th style={{ padding: '16px', textAlign: 'center', color: 'var(--gold)', fontSize: 12, fontWeight: 600 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          background: 'linear-gradient(135deg, #C9A84C, #E0C06A)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#000',
                        }}>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>{user.name || 'N/A'}</p>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>{user.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background: user.role === 'admin' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)',
                        color: user.role === 'admin' ? '#3b82f6' : 'rgba(255,255,255,0.6)',
                        border: `1px solid ${user.role === 'admin' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      }}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={user.role === 'admin'}
                        style={{
                          padding: '8px 16px',
                          background: user.role === 'admin' ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)',
                          border: `1px solid ${user.role === 'admin' ? 'rgba(255,255,255,0.1)' : 'rgba(239,68,68,0.3)'}`,
                          borderRadius: '6px',
                          color: user.role === 'admin' ? 'rgba(255,255,255,0.3)' : '#ef4444',
                          fontSize: 12,
                          cursor: user.role === 'admin' ? 'not-allowed' : 'pointer',
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
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
