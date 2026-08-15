// Recently Viewed Manager
class RecentlyViewedManager {
  constructor() {
    this.storageKey = 'recentlyViewed';
    this.maxItems = 10;
  }

  add(car) {
    if (!car || !car.id) return;

    let viewed = this.getAll();

    // Remove duplicate if exists
    viewed = viewed.filter(v => v.id !== car.id);

    // Add to beginning
    viewed.unshift({
      id: car.id,
      name: car.name,
      brand: car.brand,
      price: car.price,
      image: car.image,
      category: car.category,
      viewedAt: new Date().toISOString(),
    });

    // Limit to max items
    viewed = viewed.slice(0, this.maxItems);

    localStorage.setItem(this.storageKey, JSON.stringify(viewed));
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get recently viewed:', e);
      return [];
    }
  }

  remove(carId) {
    let viewed = this.getAll();
    viewed = viewed.filter(v => v.id !== carId);
    localStorage.setItem(this.storageKey, JSON.stringify(viewed));
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }

  getRecent(count = 5) {
    return this.getAll().slice(0, count);
  }
}

const recentlyViewedManager = new RecentlyViewedManager();

export default recentlyViewedManager;
