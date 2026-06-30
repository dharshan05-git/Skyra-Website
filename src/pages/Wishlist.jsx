import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Wishlist() {
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const { wishlist, loading } = useWishlist();

  useEffect(() => {
    document.body.style.backgroundColor = '#faf3ee';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  const products = wishlist.map((item) => item.product).filter(Boolean);

  if (loading) {
    return (
      <div className="wishlist-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--maroon)' }}>
        <div className="admin-spinner" style={{ border: '3px solid rgba(139, 29, 58, 0.1)', borderTop: '3px solid var(--maroon)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '15px', fontWeight: '500' }}>Loading your wishlist…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="wishlist-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', textAlign: 'center', padding: '0 20px', paddingTop: '120px' }}>
        <span style={{ fontSize: '48px', color: 'var(--maroon)', marginBottom: '15px' }}>♡</span>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', marginBottom: '10px', color: 'var(--maroon)' }}>Your Wishlist Awaits</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '25px', maxWidth: '400px', fontSize: '15px', lineHeight: '1.5' }}>
          Sign in to save the SKYRA pieces you love.
        </p>
        <button 
          className="btn-primary" 
          onClick={() => loginWithGoogle().catch(() => {})}
          style={{
            padding: '12px 35px',
            background: 'var(--maroon)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <section className="wishlist-page" style={{ minHeight: '80vh', paddingTop: '120px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <p className="admin-eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '12px', color: 'var(--maroon)', fontWeight: '600', margin: '0 0 5px 0' }}>
          Saved for later
        </p>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', margin: '0 0 10px 0', color: 'var(--maroon)' }}>
          My Wishlist
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '15px', margin: 0 }}>
          {products.length} piece{products.length === 1 ? '' : 's'} close to your heart.
        </p>
      </header>

      {products.length ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      ) : (
        <div className="wishlist-state wishlist-state--empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)', textAlign: 'center' }}>
          <span style={{ fontSize: '48px', color: 'var(--maroon)', marginBottom: '15px' }}>♡</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', marginBottom: '10px' }}>No saved pieces yet</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: '25px', fontSize: '15px' }}>
            Tap the heart on any product to keep it here.
          </p>
          <a 
            className="btn-primary" 
            href="/category-all"
            style={{
              display: 'inline-block',
              padding: '12px 35px',
              background: 'var(--maroon)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '15px',
              letterSpacing: '0.5px',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            Explore Collection
          </a>
        </div>
      )}
    </section>
  );
}
