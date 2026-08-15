import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import searchHistoryManager from '../utils/searchHistoryManager';

const SearchHistory = ({ onSelectSearch, onSelectFilter }) => {
  const [history, setHistory] = useState([]);
  const [savedFilters, setSavedFilters] = useState([]);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHistory(searchHistoryManager.getSearchHistory());
    setSavedFilters(searchHistoryManager.getSavedFilters());
  };

  const handleDeleteSearch = (id) => {
    searchHistoryManager.deleteSearch(id);
    loadData();
  };

  const handleDeleteFilter = (id) => {
    searchHistoryManager.deleteFilter(id);
    loadData();
  };

  const handleClearHistory = () => {
    searchHistoryManager.clearSearchHistory();
    loadData();
  };

  const handleClearFilters = () => {
    searchHistoryManager.clearSavedFilters();
    loadData();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{
      padding: '24px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
      border: '1px solid rgba(201,168,76,0.2)',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'history' ? 'var(--gold)' : 'rgba(240,237,232,0.5)',
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'none',
            borderBottom: activeTab === 'history' ? '2px solid var(--gold)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          Search History ({history.length})
        </button>
        <button
          onClick={() => setActiveTab('filters')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'filters' ? 'var(--gold)' : 'rgba(240,237,232,0.5)',
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'none',
            borderBottom: activeTab === 'filters' ? '2px solid var(--gold)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          Saved Filters ({savedFilters.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'history' ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {history.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'rgba(240,237,232,0.5)',
                fontFamily: 'var(--font-ui)',
                fontSize: '14px',
              }}>
                No search history yet
              </div>
            ) : (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    color: 'rgba(240,237,232,0.6)',
                  }}>
                    Recent Searches
                  </span>
                  <button
                    onClick={handleClearHistory}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: '6px',
                      background: 'transparent',
                      color: 'rgba(240,237,232,0.6)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '11px',
                      cursor: 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Clear All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 4 }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: 'rgba(201,168,76,0.03)',
                        border: '1px solid rgba(201,168,76,0.1)',
                        cursor: 'none',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => onSelectSearch && onSelectSearch(item.query)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '14px',
                          color: 'rgba(240,237,232,0.9)',
                          marginBottom: '4px',
                        }}>
                          {item.query}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '11px',
                          color: 'rgba(240,237,232,0.5)',
                        }}>
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSearch(item.id);
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: 'none',
                          borderRadius: '6px',
                          background: 'transparent',
                          color: 'rgba(240,237,232,0.4)',
                          cursor: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="filters"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {savedFilters.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'rgba(240,237,232,0.5)',
                fontFamily: 'var(--font-ui)',
                fontSize: '14px',
              }}>
                No saved filters yet
              </div>
            ) : (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    color: 'rgba(240,237,232,0.6)',
                  }}>
                    Your Saved Filters
                  </span>
                  <button
                    onClick={handleClearFilters}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: '6px',
                      background: 'transparent',
                      color: 'rgba(240,237,232,0.6)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '11px',
                      cursor: 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Clear All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {savedFilters.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 4 }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        borderRadius: '8px',
                        background: 'rgba(201,168,76,0.05)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        cursor: 'none',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => onSelectFilter && onSelectFilter(item.filters)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--gold)',
                          marginBottom: '8px',
                        }}>
                          {item.name}
                        </div>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          marginBottom: '6px',
                        }}>
                          {Object.entries(item.filters).map(([key, value]) => {
                            if (!value || (Array.isArray(value) && value.length === 0)) return null;
                            return (
                              <span
                                key={key}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '12px',
                                  background: 'rgba(201,168,76,0.1)',
                                  fontFamily: 'var(--font-ui)',
                                  fontSize: '11px',
                                  color: 'rgba(240,237,232,0.7)',
                                }}
                              >
                                {key}: {Array.isArray(value) ? value.join(', ') : value}
                              </span>
                            );
                          })}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '11px',
                          color: 'rgba(240,237,232,0.5)',
                        }}>
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFilter(item.id);
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: 'none',
                          borderRadius: '6px',
                          background: 'transparent',
                          color: 'rgba(240,237,232,0.4)',
                          cursor: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchHistory;
