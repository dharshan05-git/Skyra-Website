import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmModal, PageState, Toggle } from '../../components/admin/AdminControls.jsx';
import ProductFormModal from '../../components/admin/ProductFormModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { createAdminProduct, deleteAdminProduct, fetchAdminCategories, fetchAdminProducts, updateAdminProduct } from '../../services/adminApi.js';
import { resolveImageUrl } from '../../utils/imageUrl.js';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const defaultFilters = { search: '', sort: 'newest', category: '', active: '', featured: '', hot: '', newArrival: '', page: 1, limit: 10 };

export default function AdminProducts() {
  const { role } = useAuth();
  const canManage = ['superadmin', 'admin'].includes(role);
  const isSuperadmin = role === 'superadmin';
  const isLimitedAdmin = role === 'admin';
  const [filters, setFilters] = useState(defaultFilters);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [productData, categoryData] = await Promise.all([fetchAdminProducts(filters), fetchAdminCategories()]);
      setProducts(productData.products || []);
      setPagination(productData.pagination || { page: 1, pages: 1, total: 0 });
      setCategories(categoryData.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { queueMicrotask(load); }, [load]);
  useEffect(() => {
    const timer = setTimeout(() => setFilters((current) => current.search === search ? current : { ...current, search, page: 1 }), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const activeCategories = useMemo(() => categories.filter((category) => category.active), [categories]);
  const hasFilters = Boolean(filters.search || filters.category || filters.active || filters.featured || filters.hot || filters.newArrival);
  const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));
  const flash = (message) => { setNotice(message); setTimeout(() => setNotice(''), 2800); };
  const save = async (payload, id) => {
    if (id) await updateAdminProduct(id, payload);
    else await createAdminProduct(payload);
    flash(id ? 'Product updated.' : 'Product created.');
    await load();
  };
  const patch = async (product, changes, message) => {
    setBusyId(product._id);
    setError('');
    try {
      await updateAdminProduct(product._id, changes);
      setProducts((current) => current.map((item) => item._id === product._id ? { ...item, ...changes } : item));
      flash(message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId('');
    }
  };
  const remove = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget._id);
    setError('');
    try {
      await deleteAdminProduct(deleteTarget._id);
      setDeleteTarget(null);
      flash('Product permanently deleted.');
      await load();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    } finally {
      setBusyId('');
    }
  };
  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (product) => { setEditing(product); setFormOpen(true); };

  return <section className="admin-page admin-collection-page">
    <header className="admin-page-header">
      <div>
        <p className="admin-eyebrow">Catalogue</p>
        <h1>Products</h1>
        <p>{isLimitedAdmin ? 'View products and manage stock, status, and product badges.' : 'Manage every piece, price, image, badge, and variant from one place.'}</p>
      </div>
      {isSuperadmin && <div className="admin-page-actions">
        <Link className="admin-button admin-button--secondary" to="/admin/categories">Shop category images</Link>
        <button className="admin-button admin-button--primary" onClick={openAdd}>+ Add product</button>
      </div>}
    </header>

    {notice && <div className="admin-toast" role="status">✓ {notice}</div>}
    {error && !loading && <div className="admin-alert admin-alert--error admin-alert--row"><span>{error}</span><button onClick={load}>Retry</button></div>}

    <div className="admin-toolbar">
      <label className="admin-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or SKU…" /></label>
      <select value={filters.category} onChange={(event) => changeFilter('category', event.target.value)}><option value="">All categories</option>{activeCategories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select>
      <select value={filters.active} onChange={(event) => changeFilter('active', event.target.value)}><option value="">Any status</option><option value="true">Active</option><option value="false">Inactive</option></select>
      <select value={filters.featured} onChange={(event) => changeFilter('featured', event.target.value)}><option value="">Featured or not</option><option value="true">Featured</option><option value="false">Not featured</option></select>
      <select value={filters.hot} onChange={(event) => changeFilter('hot', event.target.value)}><option value="">Hot or not</option><option value="true">Hot</option><option value="false">Not hot</option></select>
      <select value={filters.newArrival} onChange={(event) => changeFilter('newArrival', event.target.value)}><option value="">New or not</option><option value="true">New</option><option value="false">Not new</option></select>
      <select value={filters.sort} onChange={(event) => changeFilter('sort', event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A-Z</option><option value="name_desc">Name Z-A</option><option value="price_asc">Price low-high</option><option value="price_desc">Price high-low</option></select>
    </div>

    <div className="admin-list-meta">
      <span>{loading ? 'Loading catalogue…' : `${pagination.total} product${pagination.total === 1 ? '' : 's'}`}</span>
      {hasFilters && <button onClick={() => { setSearch(''); setFilters(defaultFilters); }}>Clear filters</button>}
    </div>

    {loading ? <div className="admin-list-skeleton">{[1, 2, 3, 4, 5].map((item) => <div key={item} />)}</div> : products.length === 0 ? <PageState type="empty" title="No products found" message={hasFilters ? 'Try clearing a filter or using a different search.' : 'Create the first SKYRA product to begin your catalogue.'} action={isSuperadmin ? <button className="admin-button admin-button--primary" onClick={openAdd}>Add product</button> : null} /> : <div className="admin-data-card">
      <div className="admin-table-wrap">
        <table className="admin-table admin-product-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Inventory</th><th>Active</th><th>Featured</th><th>Hot</th><th>New</th><th>Actions</th>{isSuperadmin && <th aria-label="Delete" />}</tr></thead>
          <tbody>{products.map((product) => {
            const image = product.images?.find((item) => item.isPrimary) || product.images?.[0];
            const variantStock = product.variants?.length ? product.variants.reduce((sum, item) => sum + (item.stock || 0), 0) : product.stock;
            return <tr key={product._id}>
              <td><div className="admin-product-cell">{image ? <img src={resolveImageUrl(image.url)} alt="" /> : <span className="admin-product-cell__blank">◇</span>}<div><strong>{product.name}</strong><small>/{product.slug}{product.sku ? ` · ${product.sku}` : ''}</small><div>{product.featured && <span className="admin-mini-badge">Featured</span>}{product.hot && <span className="admin-mini-badge">Hot</span>}{product.newArrival && <span className="admin-mini-badge">New</span>}</div></div></div></td>
              <td>{product.category?.name || 'Uncategorised'}</td>
              <td><strong>{money.format(product.price)}</strong>{product.discount > 0 && <small>{product.discount}% off</small>}</td>
              <td><strong>{variantStock ?? 0}</strong><small>{product.variants?.length ? `${product.variants.length} variants` : 'base stock'}</small></td>
              <td><Toggle checked={product.active !== false} disabled={!canManage || busyId === product._id} onChange={(value) => patch(product, { active: value }, value ? 'Product enabled.' : 'Product disabled.')} /></td>
              <td><Toggle checked={Boolean(product.featured)} disabled={!canManage || busyId === product._id} onChange={(value) => patch(product, { featured: value }, value ? 'Product featured.' : 'Featured removed.')} /></td>
              <td><Toggle checked={Boolean(product.hot)} disabled={!canManage || busyId === product._id} onChange={(value) => patch(product, { hot: value }, value ? 'Product marked hot.' : 'Hot removed.')} /></td>
              <td><Toggle checked={Boolean(product.newArrival)} disabled={!canManage || busyId === product._id} onChange={(value) => patch(product, { newArrival: value }, value ? 'Product marked new.' : 'New removed.')} /></td>
              <td><div className="admin-row-actions">{canManage && <button onClick={() => openEdit(product)}>{isLimitedAdmin ? 'Stock' : 'Edit'}</button>}</div></td>
              {isSuperadmin && <td><button type="button" className="admin-delete-icon" onClick={() => setDeleteTarget(product)} aria-label={`Delete ${product.name}`} title="Delete product"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" /></svg></button></td>}
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>}

    {!loading && pagination.pages > 1 && <nav className="admin-pagination" aria-label="Product pages"><button disabled={pagination.page <= 1} onClick={() => changeFilter('page', pagination.page - 1)}>← Previous</button><span>Page {pagination.page} of {pagination.pages}</span><button disabled={pagination.page >= pagination.pages} onClick={() => changeFilter('page', pagination.page + 1)}>Next →</button></nav>}
    {formOpen && <ProductFormModal key={editing?._id || 'new-product'} open product={editing} categories={categories} onClose={() => setFormOpen(false)} onSave={save} stockOnly={isLimitedAdmin} />}
    <ConfirmModal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={remove} busy={busyId === deleteTarget?._id} title="Permanently delete this product?" confirmLabel="Delete permanently" message={`${deleteTarget?.name || 'This product'} will be removed from MongoDB, customer carts, wishlists, reviews, and the storefront. This cannot be undone.`} />
  </section>;
}
