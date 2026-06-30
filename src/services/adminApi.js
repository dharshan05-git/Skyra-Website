import { auth } from './firebase.js';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request(path, options = {}, authenticated = false) {
  const isFormData = options.body instanceof FormData;
  const headers = { ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}), ...options.headers };
  if (authenticated) {
    if (!auth?.currentUser) throw new Error('Please sign in to continue.');
    headers.Authorization = `Bearer ${await auth.currentUser.getIdToken()}`;
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Something went wrong. Please try again.');
  return payload.data;
}

const query = (params = {}) => { const search = new URLSearchParams(); Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') search.set(key, value); }); return search.toString() ? `?${search}` : ''; };

export const fetchDashboard = () => request('/admin/dashboard', {}, true);
export const fetchAdminProducts = (params) => request(`/admin/products${query(params)}`, {}, true);
export const createAdminProduct = (product) => request('/admin/products', { method: 'POST', body: JSON.stringify(product) }, true);
export const updateAdminProduct = (id, product) => request(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(product) }, true);
export const deleteAdminProduct = (id) => request(`/admin/products/${id}`, { method: 'DELETE' }, true);
export const fetchAdminCategories = () => request('/admin/categories', {}, true);
export const createAdminCategory = (category) => request('/admin/categories', { method: 'POST', body: JSON.stringify(category) }, true);
export const updateAdminCategory = (id, category) => request(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(category) }, true);
export const archiveAdminCategory = (id) => request(`/admin/categories/${id}`, { method: 'DELETE' }, true);
export const uploadAdminImages = (files) => { const body = new FormData(); files.forEach((file) => body.append('images', file)); return request('/uploads', { method: 'POST', body }, true); };
export const deleteAdminImage = (publicId) => request('/uploads', { method: 'DELETE', body: JSON.stringify({ publicId }) }, true);
export const fetchAdminOrders = (params) => request(`/admin/orders${query(params)}`, {}, true);
export const fetchAdminOrder = (id) => request(`/admin/orders/${id}`, {}, true).then((data) => data.order);
export const updateAdminOrderStatus = (id, update) => request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(update) }, true).then((data) => data.order);
export const deleteAdminOrder = (id) => request(`/admin/orders/${id}`, { method: 'DELETE' }, true);
export const deleteAdminOrders = (input) => request('/admin/orders', { method: 'DELETE', body: JSON.stringify(input) }, true);
export const fetchAdminUsers = (params) => request(`/admin/users${query(params)}`, {}, true);
export const updateAdminUser = (id, active) => request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ active }) }, true);
export const fetchAdmins = () => request('/admin/admins', {}, true);
export const createAdministrator = (input) => request('/admin/admins', { method: 'POST', body: JSON.stringify(input) }, true);
export const updateAdministrator = (id, input) => request(`/admin/admins/${id}`, { method: 'PATCH', body: JSON.stringify(input) }, true);
export const fetchShippingSettings = () => request('/admin/shipping', {}, true);
export const updateShippingSettings = (input) => request('/admin/shipping', { method: 'PATCH', body: JSON.stringify(input) }, true);
export const fetchSiteSettings = () => request('/admin/settings', {}, true);
export const updateSiteSettings = (input) => request('/admin/settings', { method: 'PATCH', body: JSON.stringify(input) }, true);
export const fetchAdminReviews = (params) => request(`/admin/reviews${query(params)}`, {}, true);
export const updateAdminReview = (id, approved) => request(`/admin/reviews/${id}`, { method: 'PATCH', body: JSON.stringify({ approved }) }, true);
export const deleteAdminReview = (id) => request(`/admin/reviews/${id}`, { method: 'DELETE' }, true);
export const fetchCategories = () => request('/categories');
export const fetchCategoryBySlug = (slug) => request(`/categories/${encodeURIComponent(slug)}`).then((data) => data.category);
export const fetchProducts = (params) => request(`/products${query(params)}`);
export const fetchProductBySlug = (slug) => request(`/products/${encodeURIComponent(slug)}`).then((data) => data.product);
