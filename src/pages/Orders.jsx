import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchOrder, fetchOrders } from '../services/api.js';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
const label = (status = 'pending') => status.split('_').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');

export default function Orders() {
  const { isAuthenticated, loading: authLoading, loginWithGoogle } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrders({ page, limit: 10 });
      setOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, pages: 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, page]);

  useEffect(() => {
    if (!authLoading) queueMicrotask(load);
  }, [authLoading, load]);

  const open = async (id) => {
    setDetailLoading(true);
    setError('');
    try {
      setSelected(await fetchOrder(id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  if (authLoading || loading) return <div className="orders-state"><div className="admin-spinner" /><p>Loading your orders…</p></div>;
  if (!isAuthenticated) return <div className="orders-state"><p className="admin-eyebrow">Your SKYRA account</p><h1>Sign in to see your orders</h1><p>Your order history is securely linked to your account.</p><button className="btn-primary" onClick={() => loginWithGoogle().catch((err) => setError(err.message))}>Continue with Google</button>{error && <p className="orders-error">{error}</p>}</div>;

  return (
    <section className="orders-page">
      <header><p className="admin-eyebrow">Your collection</p><h1>My orders</h1><p>Follow each piece from our studio to your door.</p></header>
      {location.state?.created && <div className="orders-success">Order {location.state.created} was placed successfully and is now pending.</div>}
      {error && <div className="orders-error">{error}</div>}
      {orders.length === 0 ? (
        <div className="orders-empty"><span>◇</span><h2>No orders yet</h2><p>Your future SKYRA purchases will appear here.</p><a href="/category-all" className="btn-primary">Explore the collection</a></div>
      ) : (
        <div className="customer-order-list">
          {orders.map((order) => (
            <article key={order._id}>
              <div className="customer-order-head">
                <div><span className={`admin-status admin-status--${order.status}`}>{label(order.status)}</span><h2>{order.orderNumber}</h2><p>Placed {date.format(new Date(order.createdAt))}</p></div>
                <div><strong>{money.format(order.total)}</strong><small>{order.items.length} item{order.items.length === 1 ? '' : 's'}</small></div>
              </div>
              <div className="customer-order-preview">
                {order.items.slice(0, 4).map((item, index) => item.image ? <img src={item.image} alt={item.name} key={`${item.product}-${index}`} /> : <span key={`${item.product}-${index}`}>◇</span>)}
                <div><p>Delivering to</p><strong>{order.shippingAddress.city}, {order.shippingAddress.state}</strong></div>
                <button onClick={() => open(order._id)} disabled={detailLoading}>{detailLoading ? 'Loading…' : 'View order'}</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {pagination.pages > 1 && <nav className="customer-order-pages"><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span>{page} / {pagination.pages}</span><button disabled={page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>Next</button></nav>}
      {selected && (
        <div className="customer-order-modal" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section>
            <button className="customer-order-modal__close" onClick={() => setSelected(null)}>×</button>
            <p className="admin-eyebrow">Order details</p>
            <h2>{selected.orderNumber}</h2>
            <div className="customer-order-detail-status"><span className={`admin-status admin-status--${selected.status}`}>{label(selected.status)}</span><span className={`admin-status admin-status--${selected.paymentStatus}`}>{label(selected.paymentStatus)} payment</span></div>
            <div className="customer-order-items">
              {selected.items.map((item, index) => (
                <div key={`${item.product}-${index}`}>{item.image ? <img src={item.image} alt={item.name} /> : <span>◇</span>}<div><strong>{item.name}</strong><small>{item.variantSku || 'Standard piece'} · Qty {item.quantity}</small></div><b>{money.format(item.lineTotal)}</b></div>
              ))}
            </div>
            <dl className="customer-order-totals"><div><dt>Subtotal</dt><dd>{money.format(selected.subtotal)}</dd></div><div><dt>Shipping</dt><dd>{selected.shippingCost ? money.format(selected.shippingCost) : 'Free'}</dd></div><div><dt>Total</dt><dd>{money.format(selected.total)}</dd></div></dl>
            <div className="customer-order-address"><p className="admin-eyebrow">Shipping to</p><strong>{selected.shippingAddress.fullName}</strong><p>{selected.shippingAddress.line1}{selected.shippingAddress.line2 ? `, ${selected.shippingAddress.line2}` : ''}<br />{selected.shippingAddress.city}, {selected.shippingAddress.state} – {selected.shippingAddress.pincode}</p></div>
          </section>
        </div>
      )}
    </section>
  );
}
