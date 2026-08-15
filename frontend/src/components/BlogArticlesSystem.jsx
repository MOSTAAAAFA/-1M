import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BlogArticlesSystem = () => {
  const [articles] = useState([
    {
      id: 1,
      title: 'Top 10 Luxury Cars of 2026',
      excerpt: 'Discover the most luxurious and technologically advanced vehicles hitting the market this year...',
      author: 'John Doe',
      date: '2 days ago',
      category: 'Reviews',
      image: 'https://via.placeholder.com/600x400/C9A84C/000000?text=Article+1',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Electric vs Hybrid: Which is Right for You?',
      excerpt: 'A comprehensive guide to help you choose between electric and hybrid luxury vehicles...',
      author: 'Sarah Smith',
      date: '1 week ago',
      category: 'Guides',
      image: 'https://via.placeholder.com/600x400/E0C06A/000000?text=Article+2',
      readTime: '8 min read'
    },
    {
      id: 3,
      title: 'Maintenance Tips for Luxury Cars',
      excerpt: 'Keep your premium vehicle in perfect condition with these expert maintenance tips...',
      author: 'Mike Johnson',
      date: '2 weeks ago',
      category: 'Tips',
      image: 'https://via.placeholder.com/600x400/C9A84C/000000?text=Article+3',
      readTime: '6 min read'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Reviews', 'Guides', 'Tips', 'News'];

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 4h12a4 4 0 0 1 4 4v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            <polyline points="4 4 16 4 16 16" />
            <line x1="4" y1="8" x2="13" y2="8" />
            <line x1="4" y1="12" x2="9" y2="12" />
            <line x1="4" y1="16" x2="7" y2="16" />
          </svg>
          Blog & Articles
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                background: selectedCategory === cat
                  ? 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)'
                  : 'rgba(255,255,255,0.05)',
                border: selectedCategory === cat
                  ? 'none'
                  : '1px solid rgba(201,168,76,0.2)',
                color: selectedCategory === cat ? '#000' : '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {filteredArticles.map((article) => (
          <motion.article
            key={article.id}
            whileHover={{ y: -8 }}
            style={{
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,76,0.2)',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            <img
              src={article.image}
              alt={article.title}
              style={{ width: '100%', height: '220px', objectFit: 'cover' }}
            />
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '12px',
                background: 'rgba(201,168,76,0.2)',
                color: 'var(--gold)',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                {article.category}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {article.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(240,237,232,0.7)',
                marginBottom: '16px',
                lineHeight: '1.6'
              }}>
                {article.excerpt}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid rgba(201,168,76,0.1)'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    {article.author}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.5)' }}>
                    {article.date}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(240,237,232,0.6)' }}>
                  ⏱ {article.readTime}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default BlogArticlesSystem;
