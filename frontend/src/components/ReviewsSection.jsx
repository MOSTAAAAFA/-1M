import React, { useState, useEffect } from 'react';

const key = (id) => `1m_reviews_${id}`;

const SEED_POOL = [
  { name: 'Omar K.', rating: 5, comment: 'Immaculate condition and an effortless purchase. The 1M team handled everything with true white-glove service.', date: '2026-03-12' },
  { name: 'Sara M.', rating: 5, comment: 'Delivered to my door within 48 hours. This car is everything the photos promised and more.', date: '2026-04-02' },
  { name: 'Liam W.', rating: 4, comment: 'Outstanding spec and exactly as described. Took a point off only for the delivery window.', date: '2026-05-21' },
  { name: 'Youssef A.', rating: 5, comment: 'A masterpiece. The test drive experience sold me instantly — highly recommend.', date: '2026-06-15' },
  { name: 'Nour T.', rating: 4, comment: 'Beautiful machine, transparent pricing. The concierge follow-up was a class act.', date: '2026-07-08' },
];

function seedReviews(carId, carName) {
  const count = 3 + (carId % 3);
  const start = carId % SEED_POOL.length;
  return Array.from({ length: count }, (_, i) => {
    const s = SEED_POOL[(start + i) % SEED_POOL.length];
    return { ...s, carName };
  });
}

function load(carId) {
  try {
    const raw = localStorage.getItem(key(carId));
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function save(carId, reviews) {
  try { localStorage.setItem(key(carId), JSON.stringify(reviews)); } catch (e) { /* ignore */ }
}

export default function ReviewsSection({ carId, carName }) {
  const [reviews, setReviews] = useState([]);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const existing = load(carId);
    setReviews(existing && existing.length ? existing : seedReviews(carId, carName));
  }, [carId, carName]);

  useEffect(() => {
    if (reviews.length) save(carId, reviews);
  }, [reviews, carId]);

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || !author.trim()) return;
    const next = [{
      name: author.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
      carName,
    }, ...reviews];
    setReviews(next);
    setAuthor('');
    setComment('');
    setRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <section style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="section-eyebrow" style={{ marginBottom: 24 }}>Owner Reviews</p>

      {/* Summary */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        flexWrap: 'wrap',
        marginBottom: '32px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 64,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #c9a84c, #e0c06a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}>{avg.toFixed(1)}</div>
          <Stars value={Math.round(avg)} size={18} />
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.4)', marginTop: 6 }}>
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: 'rgba(240,237,232,0.5)', width: 28 }}>{star}★</span>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #c9a84c, #e0c06a)', borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'rgba(240,237,232,0.3)', width: 24, textAlign: 'right' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
        {reviews.map((r, i) => (
          <div key={i} style={{
            padding: '20px 22px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#c9a84c',
                }}>{r.name.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ede8' }}>{r.name}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'rgba(240,237,232,0.3)', letterSpacing: '1px' }}>
                    {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <Stars value={r.rating} size={14} />
            </div>
            <p style={{ fontSize: 14, color: 'rgba(240,237,232,0.75)', lineHeight: 1.6, margin: 0 }}>{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Write a review */}
      <form onSubmit={handleSubmit} style={{
        padding: '26px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        border: '1px solid rgba(201,168,76,0.2)',
      }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 18 }}>
          Write a Review
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: 'rgba(240,237,232,0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>Rating:</span>
          <div style={{ display: 'flex', gap: 4 }}
            onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                  fontSize: 24,
                  lineHeight: 1,
                  color: (hoverRating || rating) >= star ? '#e0c06a' : 'rgba(240,237,232,0.15)',
                  transition: 'color 0.15s',
                  padding: 0,
                }}
              >★</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12, marginBottom: 12 }}>
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
            placeholder="Your name"
            style={inputStyle}
          />
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
            rows={3}
            placeholder="Tell others about your experience…"
            style={{ ...inputStyle, resize: 'vertical', fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        <button type="submit" style={{
          width: '100%',
          padding: '13px',
          background: submitted
            ? 'linear-gradient(135deg, #25D366, #1faa52)'
            : 'linear-gradient(135deg, #c9a84c, #e0c06a)',
          border: 'none',
          borderRadius: '10px',
          color: submitted ? '#fff' : '#050507',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}>
          {submitted ? '✓ Review Posted' : 'Submit Review'}
        </button>
      </form>
    </section>
  );
}

function Stars({ value, size }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} style={{ fontSize: size, lineHeight: 1, color: star <= value ? '#e0c06a' : 'rgba(240,237,232,0.15)' }}>★</span>
      ))}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '20px',
  color: '#f0ede8',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};
