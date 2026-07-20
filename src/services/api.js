const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function authHeaders() {
  const { auth } = await import('./firebase.js');
  if (!auth?.currentUser) throw new Error('Please sign in to continue.');
  return {
    Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
  };
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    const details = payload.details?.fieldErrors || payload.details?.formErrors;
    const fieldMessages = details && typeof details === 'object'
      ? Object.values(details).flat().filter(Boolean)
      : [];
    const message = fieldMessages.length
      ? `${payload.message || 'Request failed.'}: ${fieldMessages.join(' ')}`
      : payload.message || 'Request failed. Please try again.';
    throw new Error(message);
  }

  return payload.data ?? payload;
}

async function authenticatedRequest(path, options = {}) {
  return request(path, {
    ...options,
    headers: {
      ...(await authHeaders()),
      ...options.headers,
    },
  });
}

export const fetchProducts = (params) => request(`/products${buildQuery(params)}`);
export const fetchProductBySlug = (slug) => request(`/products/${encodeURIComponent(slug)}`).then((data) => data.product);
export const fetchCategories = () => request('/categories').then((data) => data.categories || []);
export const fetchStoreSettings = () => request('/settings');
export const subscribeNewsletter = (email) => request('/newsletter', {
  method: 'POST',
  body: JSON.stringify({ email }),
});

export const fetchCart = () => authenticatedRequest('/cart');
export const addToCart = (productId, variantSku, quantity = 1) => authenticatedRequest('/cart/items', {
  method: 'POST',
  body: JSON.stringify({ productId, variantSku: variantSku || null, quantity }),
});
export const updateCartItem = (itemId, quantity) => authenticatedRequest(`/cart/items/${itemId}`, {
  method: 'PATCH',
  body: JSON.stringify({ quantity }),
});
export const removeFromCart = (itemId) => authenticatedRequest(`/cart/items/${itemId}`, { method: 'DELETE' });
export const clearCart = () => authenticatedRequest('/cart', { method: 'DELETE' });

export const fetchWishlist = () => authenticatedRequest('/wishlist');
export const addToWishlist = (productId) => authenticatedRequest('/wishlist', {
  method: 'POST',
  body: JSON.stringify({ productId }),
});
export const removeFromWishlist = (productId) => authenticatedRequest(`/wishlist/${productId}`, { method: 'DELETE' });

export const fetchCheckoutSummary = () => authenticatedRequest('/orders/summary', {
  method: 'POST',
  body: JSON.stringify({}),
});
export const createOrder = (data) => authenticatedRequest('/orders', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const createRazorpayPaymentOrder = (orderId) => authenticatedRequest(`/payments/orders/${orderId}`, {
  method: 'POST',
});
export const verifyRazorpayPayment = (data) => authenticatedRequest('/payments/verify', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const fetchOrders = (params = {}) => authenticatedRequest(`/orders${buildQuery(params)}`);
export const fetchOrder = (id) => authenticatedRequest(`/orders/${id}`).then((data) => data.order);
