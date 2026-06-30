import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { getProductUrl } from '../utils/productUtils';

const INSTAGRAM_URL = 'https://www.instagram.com/skyra.india?igsh=MThsMG90M2E2djlhaA==';

function ProductPage({ name, price, description, specs, images, videoSrc, recommendations, isSignature, product }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [cartMsg, setCartMsg] = useState('');
  const [wishlistMsg, setWishlistMsg] = useState('');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const productId = product?._id;
  const wishlisted = productId ? isInWishlist(productId) : false;

  const mediaList = [
    ...images.map((img) => ({ type: 'image', src: img })),
    ...(videoSrc ? [{ type: 'video', src: videoSrc }] : []),
  ];

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) el.classList.add('revealed');
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!product?._id) {
      setCartMsg('Open this product from the shop to add it.');
      setTimeout(() => setCartMsg(''), 1800);
      return;
    }

    try {
      await addToCart(product, undefined, 1);
      setCartMsg('✓ Added to Cart!');
    } catch (error) {
      setCartMsg(error.message || 'Failed to add');
    } finally {
      setTimeout(() => setCartMsg(''), 1800);
    }
  };

  const handleWishlistToggle = async () => {
    if (!productId) {
      setWishlistMsg('Open this product from the shop to save it.');
      setTimeout(() => setWishlistMsg(''), 1800);
      return;
    }

    if (!isAuthenticated) {
      try {
        await loginWithGoogle();
      } catch {
        return;
      }
    }

    try {
      await toggleWishlist(productId);
      setWishlistMsg(wishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
    } catch (error) {
      setWishlistMsg(error.message || 'Wishlist failed');
    } finally {
      setTimeout(() => setWishlistMsg(''), 1800);
    }
  };

  return (
    <>
      {isSignature && (
        <div className="signature-badge-banner">
          <span className="signature-crown">👑</span>
          <span>Skyra Signature Collection</span>
        </div>
      )}
      <section className="product-detail">
        <div className="product-gallery">
          <div className="product-main-img">
            {isSignature && <span className="signature-stamp">Signature</span>}
            {mediaList[selectedImg]?.type === 'video' ? (
              <video key={mediaList[selectedImg].src} controls autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src={mediaList[selectedImg].src} type="video/mp4" />
              </video>
            ) : (
              <img src={mediaList[selectedImg]?.src} alt={name} />
            )}
          </div>
          <div className="product-thumbnails">
            {mediaList.map((item, i) => (
              <div key={i} className={`product-thumb${selectedImg === i ? ' active' : ''}`} onClick={() => setSelectedImg(i)}>
                {item.type === 'video' ? (
                  <div className="video-thumb-container" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex' }}>
                    <img src={images[0]} alt="Video Thumbnail" />
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <svg viewBox="0 0 24 24" style={{width:'20px',height:'20px',fill:'currentColor'}}><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                ) : (
                  <img src={item.src} alt={`${name} view ${i + 1}`} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="product-info">
          {isSignature && <span className="signature-tag">Signature</span>}
          <h1>{name}</h1>
          <p className="price">{price}</p>
          <p className="product-description">{description}</p>
          <div className="product-specs">
            <h3>Specifications</h3>
            <div className="specs-list">
              {specs.map((s, i) => (
                <div key={i} className="spec-row"><span className="spec-label">{s.label}</span><span className="spec-value">{s.value}</span></div>
              ))}
            </div>
          </div>
          <div className="product-actions">
            <button className="btn-add-cart" onClick={handleAddToCart}>{cartMsg || 'Add to Cart'}</button>
            <button className={`btn-wishlist-lg${wishlisted ? ' wishlisted' : ''}`} onClick={handleWishlistToggle} title={wishlistMsg || (wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist')}>
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={wishlisted ? '#c9a96e' : 'none'} /></svg>
            </button>
            {wishlistMsg && <span className="category-count" style={{ alignSelf: 'center' }}>{wishlistMsg}</span>}
          </div>
        </div>
      </section>

      <section className="recommendations">
        <div className="section-header"><h2 className="section-title">You May Also Like</h2></div>
        <div className="products-grid">
          {recommendations.map((r, i) => (
            <a key={i} href={r.href || getProductUrl(r.name)} className="product-card">
              <div className="product-card-img"><img src={r.img} alt={r.name} /></div>
              <div className="product-card-info"><p className="product-name">{r.name}</p><p className="product-price">{r.price}</p></div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

export default ProductPage;
export { INSTAGRAM_URL };
