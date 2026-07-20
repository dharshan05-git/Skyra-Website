import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const shopLinks = [
  ['Necklaces', '/category-pendants'],
  ['Rings', '/category-rings'],
  ['Earrings', '/category-earrings'],
  ['Bracelets', '/category-bracelets'],
  ['Payals', '/category-anklets'],
  ['Sets', '/category-sets'],
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState('');
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, isAdmin, loginWithGoogle, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const closeOnScroll = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('scroll', closeOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', closeOnScroll);
  }, [isMenuOpen]);

  const closeNavOverlays = () => {
    setIsMenuOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const term = search.trim();
    if (!term) return;
    navigate(`/category-all?search=${encodeURIComponent(term)}`);
    setSearch('');
    closeNavOverlays();
  };

  const accountClick = async () => {
    if (!isAuthenticated) {
      closeMenu();
      await loginWithGoogle();
      return;
    }
    setIsMenuOpen(false);
    setSearchOpen(false);
    setAccountOpen((current) => !current);
  };

  return (
    <>
      <nav
        className={`navbar${hidden ? ' navbar--hidden' : ''}${isHome ? ' navbar--home' : ''}`}
        id="navbar"
      >
        <div className="navbar-inner">
          <Link to="/" className="nav-logo" onClick={closeNavOverlays}>
            <img src="/images/skyra-nav-logo.png" alt="SKYRA" className="nav-logo-img" />
          </Link>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><NavLink to="/" onClick={closeNavOverlays}>Home</NavLink></li>
            {shopLinks.map(([label,href]) => (
              <li key={href}><NavLink to={href} onClick={closeNavOverlays}>{label}</NavLink></li>
            ))}
          </ul>
          <div className="nav-icons">
            <button
              type="button"
              className="nav-icon-button"
              aria-label="Search products"
              onClick={() => {
                setSearchOpen(true);
                setAccountOpen(false);
                setIsMenuOpen(false);
              }}
            >
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            <div className="nav-account-wrap">
              <button
                type="button"
                className="nav-icon-button"
                aria-label={isAuthenticated ? 'Open account menu' : 'Sign in'}
                onClick={() => accountClick().catch(() => {})}
              >
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
              {accountOpen && (
                <div className="nav-account-menu">
                  <p>{profile?.name || user?.displayName || 'SKYRA customer'}</p>
                  <small>{profile?.email || user?.email}</small>
                  <Link to="/orders" onClick={closeNavOverlays}>My orders</Link>
                  {isAdmin && <Link to="/admin" onClick={closeNavOverlays}>Admin Dashboard</Link>}
                  <button onClick={() => { closeNavOverlays(); logout(); }}>Sign out</button>
                </div>
              )}
            </div>
            <Link to="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`} className="nav-icon-link" onClick={closeNavOverlays}>
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wishlist.length > 0 && <span className="nav-count">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}
            </Link>
            <Link to="/cart" aria-label={`Cart with ${cart.itemCount} items`} className="nav-icon-link" onClick={closeNavOverlays}>
              <svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cart.itemCount > 0 && <span className="nav-count">{cart.itemCount > 99 ? '99+' : cart.itemCount}</span>}
            </Link>
            <button
              type="button"
              className={`hamburger ${isMenuOpen ? 'open' : ''}`}
              onClick={() => {
                setAccountOpen(false);
                setSearchOpen(false);
                setIsMenuOpen((current) => !current);
              }}
              aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMenuOpen}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      {searchOpen && (
        <div className="nav-search-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
          <form onSubmit={submitSearch}>
            <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>x</button>
            <p>Search the SKYRA collection</p>
            <div>
              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search necklaces, rings, earrings..."
              />
              <button type="submit" aria-label="Submit search">&gt;</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
