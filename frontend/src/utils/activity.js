import API_BASE from './api';

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export function trackActivity(type, car) {
  const user = getCurrentUser();
  if (type === 'view' && !user) return;
  const payload = {
    type,
    carId: car?.id || car?._id || null,
    carName: car?.name || null,
    brand: car?.brand || null,
    price: car?.price != null ? car.price : null,
  };
  try {
    fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}