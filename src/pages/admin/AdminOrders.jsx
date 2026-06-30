import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { deleteAdminOrders, fetchAdminOrders, updateAdminOrderStatus } from '../../services/adminApi.js';
import { ConfirmModal, PageState } from '../../components/admin/AdminControls.jsx';
import OrderDetailModal from '../../components/admin/OrderDetailModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { statusClass, statusLabel } from '../../utils/orderUtils.js';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const shortDate = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const defaults = { search: '', status: '', paymentStatus: '', sort: 'newest', page: 1, limit: 15 };
const statuses = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'completed', 'cancelled'];
const workflow = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'completed'];
const workflowLabel = { pending: 'Payment Pending', confirmed: 'Order Confirmed', processing: 'Processing', packed: 'Packed', shipped: 'Shipped', in_transit: 'In Transit', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', completed: 'Completed' };

function OrderWorkflowSlider({ order, onUpdate, busy }) {
  const activeIndex = Math.max(0, workflow.indexOf(order.status));
  const activeCenter = ((activeIndex + 0.5) / workflow.length) * 100;
  return (
    <motion.div className="admin-order-slider-panel" initial={{ height: 0, opacity: 0, y: -8 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -8 }} transition={{ duration: 0.24, ease: 'easeOut' }}>
      <div className="admin-order-slider-head"><div><p className="admin-eyebrow">Manual workflow</p><h3>Swipe the order forward</h3></div><span>{workflowLabel[order.status] || statusLabel(order.status)}</span></div>
      <div className="admin-order-motion-track" style={{ '--step-center': `${activeCenter}%` }}>
        {workflow.map((status, index) => (
          <button type="button" key={status} className={`admin-order-motion-step${index <= activeIndex ? ' admin-order-motion-step--done' : ''}${index === activeIndex ? ' admin-order-motion-step--active' : ''}`} onClick={() => onUpdate(order, status)} disabled={busy || status === order.status || order.status === 'cancelled'} title={`Move to ${workflowLabel[status]}`}>
            <span><i /></span><strong>{workflowLabel[status]}</strong>
          </button>
        ))}
        <motion.div className="admin-order-motion-thumb" animate={{ left: `calc(${activeCenter}% - 13px)` }} transition={{ type: 'spring', stiffness: 260, damping: 24 }} />
      </div>
      <p className="admin-order-slider-copy">Tap any step to move this order manually. The moving marker shows the current customer-facing stage.</p>
    </motion.div>
  );
}

export default function AdminOrders() {
  const { role } = useAuth();
  const canUseBulkAndInlineWorkflow = role === 'superadmin';
  const [filters, setFilters] = useState(defaults);
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [notice, setNotice] = useState('');
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminOrders(filters);
      setOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      setChecked([]);
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

  const change = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));
  const changed = (updated) => {
    setOrders((current) => current.map((order) => order._id === updated._id ? { ...order, ...updated } : order));
    setNotice(`Order ${updated.orderNumber} updated.`);
    setTimeout(() => setNotice(''), 2600);
  };
  const allPageChecked = useMemo(() => orders.length > 0 && orders.every((order) => checked.includes(order._id)), [orders, checked]);
  const toggleChecked = (id) => setChecked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const togglePage = () => setChecked((current) => allPageChecked ? current.filter((id) => !orders.some((order) => order._id === id)) : [...new Set([...current, ...orders.map((order) => order._id)])]);
  const updateInlineStatus = async (order, status) => {
    setBusy(order._id);
    setError('');
    try {
      const updated = await updateAdminOrderStatus(order._id, { status, note: `Manual admin workflow update: ${workflowLabel[status]}` });
      changed(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };
  const removeOrders = async () => {
    if (!deleteTarget) return;
    setBusy('delete');
    setError('');
    try {
      const payload = deleteTarget.type === 'all' ? { all: true } : { ids: deleteTarget.ids };
      const result = await deleteAdminOrders(payload);
      setDeleteTarget(null);
      setNotice(`${result.deletedCount || 0} order${result.deletedCount === 1 ? '' : 's'} deleted.`);
      setTimeout(() => setNotice(''), 2600);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <section className="admin-page admin-collection-page">
      <header className="admin-page-header"><div><p className="admin-eyebrow">Fulfilment</p><h1>Orders</h1><p>Review every purchase and guide it carefully from placement to delivery.</p></div></header>
      {notice && <div className="admin-toast">✓ {notice}</div>}
      {error && !loading && <div className="admin-alert admin-alert--error admin-alert--row"><span>{error}</span><button onClick={load}>Retry</button></div>}
      <div className="admin-toolbar admin-order-toolbar"><label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Order, customer, email, or mobile…" /></label><select value={filters.status} onChange={(event) => change('status', event.target.value)}><option value="">All order statuses</option>{statuses.map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select><select value={filters.paymentStatus} onChange={(event) => change('paymentStatus', event.target.value)}><option value="">All payment statuses</option>{['pending', 'paid', 'failed', 'refunded'].map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select><select value={filters.sort} onChange={(event) => change('sort', event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="amount_high">Highest amount</option><option value="amount_low">Lowest amount</option></select></div>
      <div className="admin-list-meta"><span>{loading ? 'Loading orders…' : `${pagination.total} order${pagination.total === 1 ? '' : 's'}`}</span>{(filters.search || filters.status || filters.paymentStatus || filters.sort !== 'newest') && <button onClick={() => { setSearch(''); setFilters(defaults); }}>Clear filters</button>}</div>
      {!loading && orders.length > 0 && canUseBulkAndInlineWorkflow && <div className="admin-order-bulkbar"><label><input type="checkbox" checked={allPageChecked} onChange={togglePage} /> Select this page</label><span>{checked.length} selected</span><button type="button" className="admin-button admin-button--danger" disabled={!checked.length || busy === 'delete'} onClick={() => setDeleteTarget({ type: 'selected', ids: checked })}>Delete selected</button><button type="button" className="admin-button admin-button--secondary admin-button--danger-outline" disabled={!pagination.total || busy === 'delete'} onClick={() => setDeleteTarget({ type: 'all' })}>Delete all orders</button></div>}
      {loading ? <div className="admin-list-skeleton">{[1, 2, 3, 4, 5].map((item) => <div key={item} />)}</div> : orders.length === 0 ? <PageState type="empty" title="No orders found" message={filters.search || filters.status || filters.paymentStatus ? 'No orders match the current filters.' : 'New customer orders will appear here as soon as checkout is completed.'} /> : <div className="admin-data-card"><div className="admin-table-wrap"><table className="admin-table admin-orders-table"><thead><tr>{canUseBulkAndInlineWorkflow && <th><span className="sr-only">Select</span></th>}<th>Order</th><th>Customer</th><th>Contact</th><th>Date</th><th>Amount</th><th>Payment</th><th>Status</th><th /></tr></thead><tbody>{orders.map((order) => <Fragment key={order._id}><tr className={expanded === order._id ? 'admin-order-row--expanded' : ''} onClick={() => { if (canUseBulkAndInlineWorkflow) setExpanded((current) => current === order._id ? '' : order._id); }}>{canUseBulkAndInlineWorkflow && <td onClick={(event) => event.stopPropagation()}><input className="admin-order-check" type="checkbox" checked={checked.includes(order._id)} onChange={() => toggleChecked(order._id)} aria-label={`Select order ${order.orderNumber}`} /></td>}<td><strong>{order.orderNumber}</strong><small>{order.items.length} item{order.items.length === 1 ? '' : 's'}</small></td><td><strong>{order.shippingAddress.fullName}</strong><small>{order.shippingAddress.city}, {order.shippingAddress.state}</small></td><td>{order.shippingAddress.email}<small>{order.shippingAddress.phone}</small></td><td>{shortDate.format(new Date(order.createdAt))}</td><td><strong>{money.format(order.total)}</strong></td><td><span className={statusClass(order.paymentStatus)}>{statusLabel(order.paymentStatus)}</span></td><td><span className={statusClass(order.status)}>{workflowLabel[order.status] || statusLabel(order.status)}</span></td><td onClick={(event) => event.stopPropagation()}><button className="admin-view-button" onClick={() => setSelectedId(order._id)}>View details</button></td></tr>{canUseBulkAndInlineWorkflow && expanded === order._id && <tr className="admin-order-slider-row"><td colSpan="9"><OrderWorkflowSlider order={order} onUpdate={updateInlineStatus} busy={busy === order._id} /></td></tr>}</Fragment>)}</tbody></table></div></div>}
      {!loading && pagination.pages > 1 && <nav className="admin-pagination"><button disabled={pagination.page <= 1} onClick={() => change('page', pagination.page - 1)}>← Previous</button><span>Page {pagination.page} of {pagination.pages}</span><button disabled={pagination.page >= pagination.pages} onClick={() => change('page', pagination.page + 1)}>Next →</button></nav>}
      {selectedId && <OrderDetailModal key={selectedId} orderId={selectedId} onClose={() => setSelectedId('')} onChanged={changed} hideStatusHistory={role === 'admin'} />}
      <ConfirmModal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={removeOrders} busy={busy === 'delete'} title={deleteTarget?.type === 'all' ? 'Delete all orders?' : 'Delete selected orders?'} confirmLabel="Delete orders" message={deleteTarget?.type === 'all' ? `This will permanently delete all ${pagination.total} orders from MongoDB. Pending unpaid orders will release reserved stock.` : `This will permanently delete ${deleteTarget?.ids?.length || 0} selected order${deleteTarget?.ids?.length === 1 ? '' : 's'} from MongoDB. Pending unpaid orders will release reserved stock.`} />
    </section>
  );
}
