import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import API_BASE from '../utils/api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, ratingFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/reviews?limit=200`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      } else {
        const err = await response.json().catch(() => ({}));
        console.error('Failed to fetch reviews:', err);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review? This action cannot be undone.')) return;

    try {
      const response = await fetch(`${API_BASE}/admin/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  const filteredReviews = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return reviews.filter((review) => {
      const ratingOk = ratingFilter === 'all' || Number(review.rating) === Number(ratingFilter);
      if (!ratingOk) return false;
      if (!q) return true;
      const userName = review.user?.name || '';
      const userEmail = review.user?.email || '';
      const productName = review.product?.name || '';
      const productBrand = review.product?.brand || '';
      const title = review.title || '';
      const comment = review.comment || '';
      return [userName, userEmail, productName, productBrand, title, comment]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [reviews, searchTerm, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
      : '0.0';

  const renderStars = (rating) => {
    const n = Math.max(0, Math.min(5, Number(rating) || 0));
    return (
      <span style={{ color: '#f59e0b', letterSpacing: '1px', fontSize: 14 }} title={`${n} / 5`}>
        {'★'.repeat(n)}
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>{'★'.repeat(5 - n)}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Reviews</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Loading reviews...</p>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 72,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)',
                  backgroundSize: '200% 100%',
                }}
              />
            ))}
          </div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Reviews Management</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            View and moderate customer reviews
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              padding: '20px',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '12px',
            }}
          >
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
              Total Reviews
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)', margin: 0 }}>{reviews.length}</p>
          </div>
          <div
            style={{
              padding: '20px',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '12px',
            }}
          >
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
              Average Rating
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b', margin: 0 }}>{avgRating}</p>
          </div>
          <div
            style={{
              padding: '20px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '12px',
            }}
          >
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>
              Verified
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#22c55e', margin: 0 }}>
              {reviews.filter((r) => r.verified).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 24,
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Search by user, product, title, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: '1 1 320px',
              maxWidth: 560,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              color: '#fff',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              color: '#fff',
              fontSize: 14,
              outline: 'none',
              minWidth: 160,
            }}
          >
            <option value="all" style={{ color: '#111' }}>
              All Ratings
            </option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r} style={{ color: '#111' }}>
                {r} Stars
              </option>
            ))}
          </select>
          <button
            onClick={fetchReviews}
            style={{
              padding: '12px 18px',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '20px',
              color: '#fff',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>

        {/* Reviews Table */}
        <div
          style={{
            background: 'rgba(17,17,23,0.6)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '12px',
            overflow: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                <th style={thStyle}>PRODUCT</th>
                <th style={thStyle}>USER</th>
                <th style={thStyle}>RATING</th>
                <th style={thStyle}>REVIEW</th>
                <th style={thStyle}>DATE</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
                    No reviews found
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((review) => (
                  <tr key={review._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'top' }}>
                    <td style={tdStyle}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                        {review.product?.name || 'Unknown Product'}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                        {review.product?.brand || '—'}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 4 }}>
                        {review.user?.name || 'Unknown User'}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                        {review.user?.email || '—'}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div>{renderStars(review.rating)}</div>
                      {review.verified && (
                        <div
                          style={{
                            marginTop: 6,
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 999,
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            color: '#22c55e',
                            background: 'rgba(34,197,94,0.12)',
                            border: '1px solid rgba(34,197,94,0.25)',
                          }}
                        >
                          Verified
                        </div>
                      )}
                    </td>
                    <td style={{ ...tdStyle, minWidth: 320, maxWidth: 520 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
                        {review.title || '(No title)'}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: 'rgba(255,255,255,0.65)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {review.comment || ''}
                      </div>
                      {typeof review.helpful === 'number' && review.helpful > 0 && (
                        <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                          Helpful: {review.helpful}
                        </div>
                      )}
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                      {review.createdAt ? new Date(review.createdAt).toLocaleString() : '—'}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button
                        onClick={() => deleteReview(review._id)}
                        style={{
                          padding: '8px 14px',
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '8px',
                          color: '#ef4444',
                          fontSize: 12,
                          fontWeight: 600,
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
        {filteredReviews.length > itemsPerPage && (
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
            <span style={{ padding: '8px 16px', color: '#fff', fontSize: 13 }}>
              Page {currentPage} of {totalPages} · {filteredReviews.length} result{filteredReviews.length === 1 ? '' : 's'}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

const thStyle = {
  padding: '16px',
  textAlign: 'left',
  color: 'var(--gold)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.5px',
};

const tdStyle = {
  padding: '16px',
};
