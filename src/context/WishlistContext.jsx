import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../services/api.js';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWishlist();
      setWishlist(res.items || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    queueMicrotask(loadWishlist);
  }, [loadWishlist]);

  const toggleWishlist = async (productId) => {
    const exists = wishlist.some(
      (item) => (item.product?._id || item.product) === productId
    );

    try {
      if (exists) {
        const res = await removeFromWishlist(productId);
        setWishlist(res.items || []);
      } else {
        const res = await addToWishlist(productId);
        setWishlist(res.items || []);
      }
      return true;
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) => (item.product?._id || item.product) === productId
    );
  };

  const value = {
    wishlist,
    loading,
    toggleWishlist,
    isInWishlist,
    refreshWishlist: loadWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
