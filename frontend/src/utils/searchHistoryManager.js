// Search History Manager
class SearchHistoryManager {
  constructor() {
    this.storageKey = 'searchHistory';
    this.filtersKey = 'savedFilters';
    this.maxHistory = 10;
  }

  // Save search query
  saveSearch(query) {
    if (!query || query.trim() === '') return;

    const history = this.getSearchHistory();
    const newEntry = {
      id: Date.now(),
      query: query.trim(),
      timestamp: new Date().toISOString(),
    };

    // Remove duplicate if exists
    const filtered = history.filter(item =>
      item.query.toLowerCase() !== query.toLowerCase()
    );

    // Add to beginning and limit to max
    const updated = [newEntry, ...filtered].slice(0, this.maxHistory);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  // Get search history
  getSearchHistory() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // Clear search history
  clearSearchHistory() {
    localStorage.removeItem(this.storageKey);
  }

  // Delete specific search
  deleteSearch(id) {
    const history = this.getSearchHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  // Save filters
  saveFilters(name, filters) {
    if (!name || !filters) return;

    const savedFilters = this.getSavedFilters();
    const newFilter = {
      id: Date.now(),
      name: name.trim(),
      filters: filters,
      timestamp: new Date().toISOString(),
    };

    const updated = [newFilter, ...savedFilters];
    localStorage.setItem(this.filtersKey, JSON.stringify(updated));
    return newFilter;
  }

  // Get saved filters
  getSavedFilters() {
    try {
      const data = localStorage.getItem(this.filtersKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // Delete saved filter
  deleteFilter(id) {
    const filters = this.getSavedFilters();
    const filtered = filters.filter(item => item.id !== id);
    localStorage.setItem(this.filtersKey, JSON.stringify(filtered));
  }

  // Clear all saved filters
  clearSavedFilters() {
    localStorage.removeItem(this.filtersKey);
  }
}

const searchHistoryManager = new SearchHistoryManager();

export default searchHistoryManager;
