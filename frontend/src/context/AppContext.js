import React, { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const initialState = {
  cart: [],
  favorites: [],
  compareList: [],
  toasts: [],
  cartOpen: false,
};

let toastId = 0;

function reducer(state, action) {
  switch (action.type) {

    /* ─── Cart ─── */
    case 'ADD_TO_CART': {
      const exists = state.cart.find(i => i.id === action.payload.id);
      return {
        ...state,
        cart: exists
          ? state.cart.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i)
          : [...state.cart, { ...action.payload, qty: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.id !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        cart: state.cart.map(i =>
          i.id === action.payload.id ? { ...i, qty: Math.max(1, action.payload.qty) } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };

    /* ─── Favorites ─── */
    case 'TOGGLE_FAVORITE': {
      const isFav = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    }

    /* ─── Compare ─── */
    case 'ADD_TO_COMPARE': {
      if (state.compareList.length >= 3) return state;
      if (state.compareList.includes(action.payload)) return state;
      return { ...state, compareList: [...state.compareList, action.payload] };
    }
    case 'REMOVE_FROM_COMPARE':
      return { ...state, compareList: state.compareList.filter(id => id !== action.payload) };
    case 'CLEAR_COMPARE':
      return { ...state, compareList: [] };

    /* ─── Toasts ─── */
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };

    /* ─── Cart sidebar ─── */
    case 'SET_CART_OPEN':
      return { ...state, cartOpen: action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* ─── Toasts ─── */
  const addToast = useCallback((toast) => {
    const id = ++toastId;
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  /* ─── Cart actions ─── */
  const addToCart = useCallback((car) => {
    dispatch({ type: 'ADD_TO_CART', payload: car });
    dispatch({ type: 'SET_CART_OPEN', payload: true });
    addToast({ type: 'success', message: `${car.name} added to your Garage` });
  }, [addToast]);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  }, []);

  const updateQty = useCallback((id, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  /* ─── Favorites ─── */
  const toggleFavorite = useCallback((car) => {
    const isFav = state.favorites.includes(car.id);
    dispatch({ type: 'TOGGLE_FAVORITE', payload: car.id });
    addToast({
      type: isFav ? 'info' : 'success',
      message: isFav ? `${car.name} removed from Favorites` : `${car.name} saved to Favorites ♥`,
    });
  }, [state.favorites, addToast]);

  /* ─── Compare ─── */
  const addToCompare = useCallback((car) => {
    if (state.compareList.length >= 3) {
      addToast({ type: 'warning', message: 'Compare limit: 3 vehicles maximum' });
      return;
    }
    if (state.compareList.includes(car.id)) {
      addToast({ type: 'info', message: `${car.name} is already in Compare` });
      return;
    }
    dispatch({ type: 'ADD_TO_COMPARE', payload: car.id });
    addToast({ type: 'success', message: `${car.name} added to Compare` });
  }, [state.compareList, addToast]);

  const removeFromCompare = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_COMPARE', payload: id });
  }, []);

  const clearCompare = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPARE' });
  }, []);

  /* ─── Cart sidebar ─── */
  const setCartOpen = useCallback((open) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open });
  }, []);

  /* ─── Derived values ─── */
  const cartTotal  = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount  = state.cart.reduce((s, i) => s + i.qty, 0);
  const isFavorite = (id) => state.favorites.includes(id);
  const isInCompare = (id) => state.compareList.includes(id);
  const isInCart    = (id) => state.cart.some(i => i.id === id);

  return (
    <AppContext.Provider value={{
      cart: state.cart,
      favorites: state.favorites,
      compareList: state.compareList,
      toasts: state.toasts,
      cartOpen: state.cartOpen,
      cartTotal,
      cartCount,
      isFavorite,
      isInCompare,
      isInCart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      toggleFavorite,
      addToCompare,
      removeFromCompare,
      clearCompare,
      addToast,
      removeToast,
      setCartOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}