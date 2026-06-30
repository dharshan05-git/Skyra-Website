import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboard } from '../../services/adminApi.js';

const money = new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
const shortDate = new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const statusClass = (status='pending') => `admin-status admin-status--${status}`;

function Skeleton() { return <div className="admin-dashboard" aria-label="Loading dashboard"><div className="admin-page-header admin-skeleton admin-skeleton--header"/><div className="admin-stats">{[1,2,3,4].map(i=><div key={i} className="admin-stat admin-skeleton admin-skeleton--card"/>)}</div><div className="admin-dashboard-grid"><div className="admin-panel admin-skeleton admin-skeleton--panel"/><div className="admin-panel admin-skeleton admin-skeleton--panel"/></div></div>; }

export default function AdminDashboard(){
  const [data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const load=useCallback(async()=>{setLoading(true);setError('');try{setData(await fetchDashboard());}catch(err){setError(err.message);}finally{setLoading(false);}},[]);
  useEffect(()=>{queueMicrotask(load);},[load]);
  if(loading)return <Skeleton/>;
  if(error)return <section className="admin-page"><div className="admin-state admin-state--error"><span>!</span><p className="admin-eyebrow">Dashboard unavailable</p><h1>We couldn’t load your overview</h1><p>{error}</p><button className="admin-button admin-button--primary" onClick={load}>Try again</button></div></section>;
  const stats=data?.stats||{},orders=data?.recentOrders||[],lowStock=data?.lowStock||[];
  const cards=[['Revenue',money.format(stats.revenue||0),'Paid order value','revenue'],['Orders',stats.orders||0,'All-time orders','orders'],['Products',stats.products||0,'Active pieces','products'],['Customers',stats.users||0,'Registered profiles','users']];
  return <section className="admin-page admin-dashboard">
    <header className="admin-page-header"><div><p className="admin-eyebrow">Overview</p><h1>Good to see you.</h1><p>Here’s what is happening across SKYRA today.</p></div><div className="admin-page-actions"><Link to="/admin/products" className="admin-button admin-button--secondary">Manage catalogue</Link><Link to="/admin/orders" className="admin-button admin-button--primary">View orders</Link></div></header>
    <div className="admin-stats">{cards.map(([label,value,note,tone])=><article className={`admin-stat admin-stat--${tone}`} key={label}><div className="admin-stat__top"><span>{label}</span><span className="admin-stat__ornament">✦</span></div><strong>{value}</strong><small>{note}</small></article>)}</div>
    <div className="admin-dashboard-grid">
      <article className="admin-panel admin-panel--wide"><div className="admin-panel__header"><div><p className="admin-eyebrow">Latest activity</p><h2>Recent orders</h2></div><Link to="/admin/orders">View all</Link></div>{orders.length===0?<div className="admin-empty"><span>◇</span><h3>No orders yet</h3><p>New customer orders will appear here.</p></div>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(order=><tr key={order._id}><td><strong>{order.orderNumber}</strong></td><td><span>{order.user?.name||order.shippingAddress?.fullName||'Guest'}</span><small>{order.user?.email||order.shippingAddress?.email}</small></td><td>{shortDate.format(new Date(order.createdAt))}</td><td>{money.format(order.total||0)}</td><td><span className={statusClass(order.status)}>{order.status}</span></td></tr>)}</tbody></table></div>}</article>
      <article className="admin-panel"><div className="admin-panel__header"><div><p className="admin-eyebrow">Inventory watch</p><h2>Low stock</h2></div><Link to="/admin/products">Catalogue</Link></div>{lowStock.length===0?<div className="admin-empty"><span>✓</span><h3>Stock looks healthy</h3><p>No products are below their alert threshold.</p></div>:<ul className="admin-stock-list">{lowStock.map(item=><li key={item._id}><div><strong>{item.name}</strong><small>{item.sku||'No SKU'} · threshold {item.lowStockThreshold}</small></div><span>{item.stock} left</span></li>)}</ul>}</article>
    </div>
    <article className="admin-panel admin-quick"><div><p className="admin-eyebrow">Quick access</p><h2>Keep the store moving</h2></div><div className="admin-quick__links"><Link to="/admin/products">Add a product <span>→</span></Link><Link to="/admin/categories">Manage categories <span>→</span></Link><Link to="/admin/shipping">Review shipping <span>→</span></Link><Link to="/admin/users">View customers <span>→</span></Link></div></article>
  </section>;
}
