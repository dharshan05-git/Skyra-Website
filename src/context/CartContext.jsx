import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext.jsx';
import { fetchCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../services/api.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], itemCount: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const mergeInProgress = useRef(false);

  const computeLocalTotals = (items) => {
    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotal = items.reduce((sum, item) => {
      const price = item.priceAtAdd || (item.product?.price * (1 - (item.product?.discount || 0) / 100)) || 0;
      return sum + price * (item.quantity || 0);
    }, 0);
    return { items, itemCount, subtotal };
  };

  const parseGuestCart = (saved) => {
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const loadGuestCart = useCallback(() => {
    try {
      const saved = localStorage.getItem('skyra_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCart(computeLocalTotals(Array.isArray(parsed) ? parsed : []));
      } else {
        setCart({ items: [], itemCount: 0, subtotal: 0 });
      }
    } catch (err) {
      console.error('Error loading guest cart:', err);
      localStorage.removeItem('skyra_cart');
      setCart({ items: [], itemCount: 0, subtotal: 0 });
    }
  }, []);

  const loadBackendCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCart();
      const items = res.items || [];
      setCart(computeLocalTotals(items));
    } catch (err) {
      console.error('Failed to load cart from backend:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const mergeGuestCartWithBackend = useCallback(async (savedCartStr) => {
    if (mergeInProgress.current) return;
    mergeInProgress.current = true;
    setLoading(true);
    try {
      const guestItems = parseGuestCart(savedCartStr);
      for (const item of guestItems) {
        const pId = item.product?._id || item.product;
        if (pId) {
          await apiAddToCart(pId, item.variantSku || undefined, item.quantity);
        }
      }
      localStorage.removeItem('skyra_cart');
      await loadBackendCart();
    } catch (err) {
      console.error('Failed to merge guest cart with backend:', err);
    } finally {
      setLoading(false);
      mergeInProgress.current = false;
    }
  }, [loadBackendCart]);

  useEffect(() => {
    if (isAuthenticated) {
      const saved = localStorage.getItem('skyra_cart');
      if (saved && !mergeInProgress.current) {
        mergeGuestCartWithBackend(saved);
      } else if (!mergeInProgress.current) {
        loadBackendCart();
      }
    } else {
      queueMicrotask(loadGuestCart);
    }
  }, [isAuthenticated, loadBackendCart, loadGuestCart, mergeGuestCartWithBackend]);

  const addToCart = async (product, variantSku, quantity = 1) => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const res = await apiAddToCart(product._id, variantSku, quantity);
        setCart(computeLocalTotals(res.items || []));
      } catch (err) {
        console.error('Failed to add to cart:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const saved = localStorage.getItem('skyra_cart');
      const currentItems = parseGuestCart(saved);
      const normalizedVariantSku = variantSku?.trim().toUpperCase() || null;
      
      const existingIdx = currentItems.findIndex(
        (item) =>
          (item.product?._id || item.product) === product._id &&
          (item.variantSku || null) === normalizedVariantSku
      );

      const selectedVariant = normalizedVariantSku
        ? product.variants?.find((variant) => variant.sku?.toUpperCase() === normalizedVariantSku)
        : null;
      const price = selectedVariant?.price ?? product.price ?? 0;
      const discount = product.discount || 0;
      const priceAtAdd = Math.round(price * (1 - discount / 100) * 100) / 100;

      if (existingIdx > -1) {
        currentItems[existingIdx].quantity += quantity;
      } else {
        currentItems.push({
          _id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          product,
          variantSku: normalizedVariantSku,
          quantity,
          priceAtAdd,
        });
      }

      localStorage.setItem('skyra_cart', JSON.stringify(currentItems));
      setCart(computeLocalTotals(currentItems));
    }
  };

  const updateQty = async (itemId, quantity) => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const res = await apiUpdateCartItem(itemId, quantity);
        setCart(computeLocalTotals(res.items || []));
      } catch (err) {
        console.error('Failed to update cart quantity:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const saved = localStorage.getItem('skyra_cart');
      if (!saved) return;
      let currentItems = parseGuestCart(saved);

      if (quantity <= 0) {
        currentItems = currentItems.filter((item) => item._id !== itemId);
      } else {
        const idx = currentItems.findIndex((item) => item._id === itemId);
        if (idx > -1) {
          currentItems[idx].quantity = quantity;
        }
      }

      localStorage.setItem('skyra_cart', JSON.stringify(currentItems));
      setCart(computeLocalTotals(currentItems));
    }
  };

  const removeItem = async (itemId) => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const res = await apiRemoveFromCart(itemId);
        setCart(computeLocalTotals(res.items || []));
      } catch (err) {
        console.error('Failed to remove from cart:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const saved = localStorage.getItem('skyra_cart');
      if (!saved) return;
      let currentItems = parseGuestCart(saved);

      currentItems = currentItems.filter((item) => item._id !== itemId);

      localStorage.setItem('skyra_cart', JSON.stringify(currentItems));
      setCart(computeLocalTotals(currentItems));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        await apiClearCart();
        setCart({ items: [], itemCount: 0, subtotal: 0 });
      } catch (err) {
        console.error('Failed to clear cart:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      localStorage.removeItem('skyra_cart');
      setCart({ items: [], itemCount: 0, subtotal: 0 });
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    refreshCart: isAuthenticated ? loadBackendCart : loadGuestCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
