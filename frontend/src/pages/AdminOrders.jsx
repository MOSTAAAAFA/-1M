import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import API_BASE from '../utils/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert('Order status updated successfully!');
        fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    }
  };

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.status === filterStatus
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', color: '#fbbf24' };
      case 'processing': return { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', color: '#3b82f6' };
      case 'completed': return { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: '#22c55e' };
      case 'cancelled': return { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' };
      default: return { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', color: '#fff' };
    }
  };

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
              <p style={{ color: 'var(--gold)', fontSize: 14 }}>LOADING ORDERS...</p>
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
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
            Orders Management
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            View and manage customer orders
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{
            padding: '20px',
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.2)',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>Pending</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#fbbf24', margin: 0 }}>
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>Processing</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6', margin: 0 }}>
              {orders.filter(o => o.status === 'processing').length}
            </p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>Completed</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#22c55e', margin: 0 }}>
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>Cancelled</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#ef4444', margin: 0 }}>
              {orders.filter(o => o.status === 'cancelled').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 24 }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div style={{
          background: 'rgba(17,17,23,0.6)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>ORDER ID</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>CUSTOMER</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>PRODUCT</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>AMOUNT</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>STATUS</th>
                <th style={{ padding: '16px', textAlign: 'center', color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px', color: '#fff', fontFamily: 'monospace' }}>
                        #{order._id?.substring(0, 8).toUpperCase()}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>
                          {order.user?.name || 'N/A'}
                        </p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>
                          {order.user?.email || 'N/A'}
                        </p>
                      </td>
                      <td style={{ padding: '16px', color: '#fff' }}>
                        {order.products?.map(p => p.name).join(', ') || 'N/A'}
                      </td>
                      <td style={{ padding: '16px', color: '#fff', fontWeight: 600 }}>
                        ${order.totalAmount?.toLocaleString() || '0'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`,
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
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
