import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './admin-icons.css';

const links = [
  ['dashboard','Dashboard','/admin'], ['products','Products','/admin/products'], ['categories','Categories','/admin/categories'],
  ['orders','Orders','/admin/orders'], ['shipping','Shipping','/admin/shipping'],
  ['users','Customers','/admin/users'], ['admins','Administrators','/admin/admins'], ['settings','Settings','/admin/settings'],
];
const paths = { dashboard:'M3 12l9-9 9 9v9H3z M9 21v-6h6v6', products:'M4 7l8-4 8 4v10l-8 4-8-4z M4 7l8 4 8-4 M12 11v10', categories:'M4 5h6v6H4z M14 5h6v6h-6z M4 15h6v4H4z M14 15h6v4h-6z', orders:'M6 3h12l2 5-2 13H6L4 8z M4 8h16 M9 12h6', shipping:'M3 6h11v11H3z M14 10h4l3 4v3h-7z M7 20a2 2 0 100-4 2 2 0 000 4z M18 20a2 2 0 100-4 2 2 0 000 4z', users:'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M22 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75', admins:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-5', settings:'M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.12 3.67-.09-.03a1.7 1.7 0 00-1.8.25 1.7 1.7 0 00-.62 1.72V22h-4.24v-.1a1.7 1.7 0 00-.63-1.62 1.7 1.7 0 00-1.8-.25l-.08.03L6.3 16.4l.07-.07A1.7 1.7 0 006.7 14.5a1.7 1.7 0 00-1.46-1.13H5V9.13h.1A1.7 1.7 0 006.7 8a1.7 1.7 0 00-.34-1.88l-.06-.06L8.42 2.4l.09.03a1.7 1.7 0 001.8-.25A1.7 1.7 0 0010.93.5V.4h4.24v.1a1.7 1.7 0 00.63 1.62 1.7 1.7 0 001.8.25l.08-.03L19.8 6l-.07.07A1.7 1.7 0 0019.4 8a1.7 1.7 0 001.46 1.13H21v4.24h-.1A1.7 1.7 0 0019.4 15z' };
function Icon({ name }) { return <svg className="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>; }

export default function AdminLayout() {
  const [open,setOpen]=useState(false); const { profile,user,role,logout }=useAuth();
  const name=profile?.name||user?.displayName||'SKYRA Admin'; const email=profile?.email||user?.email||''; const initials=name.split(' ').map(v=>v[0]).join('').slice(0,2).toUpperCase();
  return <div className="admin-shell">
    {open&&<button className="admin-sidebar-overlay" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}
    <aside className={`admin-sidebar ${open?'admin-sidebar--open':''}`}>
      <div className="admin-brand"><span className="admin-brand__gem">S</span><div><strong>SKYRA</strong><small>Administration</small></div><button className="admin-sidebar-close" onClick={()=>setOpen(false)} aria-label="Close menu">×</button></div>
      <nav className="admin-nav" aria-label="Admin navigation">{links.filter(([icon])=>icon!=='admins'||role==='superadmin').map(([icon,label,to])=><NavLink key={to} end={to==='/admin'} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`admin-nav__link${isActive?' admin-nav__link--active':''}`}><Icon name={icon}/><span>{label}</span></NavLink>)}</nav>
      <div className="admin-sidebar__foot"><span className="admin-sidebar__spark">✦</span><div><strong>SKYRA Studio</strong><small>Make every detail shine.</small></div></div>
    </aside>
    <div className="admin-workspace">
      <header className="admin-topbar"><button className="admin-menu-button" onClick={()=>setOpen(true)} aria-label="Open menu"><span/><span/><span/></button><div className="admin-topbar__title"><span>Admin workspace</span><small>{new Intl.DateTimeFormat('en-IN',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}</small></div><div className="admin-topbar__actions"><a href="/" className="admin-store-link">View store ↗</a><div className="admin-user"><span className="admin-avatar">{initials}</span><div><strong>{name}</strong><small>{role} · {email}</small></div></div><button className="admin-logout" onClick={logout}>Sign out</button></div></header>
      <main className="admin-main"><Outlet/></main>
    </div>
  </div>;
}
