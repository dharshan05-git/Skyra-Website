import { useState, useEffect } from 'react';

export default function ProductAquaHeart() {
  const [selectedImg, setSelectedImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartMsg, setCartMsg] = useState(false);

  const images = [
    'images/products/aqua-heart-1.jpeg',
    'images/products/aqua-heart-2.webp',
    'images/products/aqua-heart-3.webp',
    'images/products/aqua-heart-4.webp',
    'images/products/aqua-heart-5.webp',
  ];

const mediaList = [
    ...images.map((img) => ({ type: 'image', src: img })),
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

  const handleAddToCart = () => {
    setCartMsg(true);
    setTimeout(() => { setCartMsg(false); }, 1500);
  };

  return (
    <>

      <section className="product-detail">
        <div className="product-gallery">
          <div className="product-main-img">
            {mediaList[selectedImg]?.type === 'video' ? (
              <video key={mediaList[selectedImg].src} controls autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src={mediaList[selectedImg].src} type="video/mp4" />
              </video>
            ) : (
              <img src={mediaList[selectedImg]?.src} alt="Aqua Heart Pendant" />
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
                  <img src={item.src} alt={`Aqua Heart Pendant view ${i + 1}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>The Aqua Heart Pendant</h1>
          <p className="price">₹599</p>
          <p className="product-description">
            Soft, romantic, and effortlessly elegant — the Aqua Heart Pendant features a luminous aqua blue heart-shaped crystal framed by delicate zircon accents. The cool-toned center stone creates a calm yet eye-catching sparkle, making it ideal for both everyday wear and special moments. Set on a fine silver-tone chain, it adds a refined pop of colour without feeling heavy.
          </p>
          <div className="product-specs">
            <h3>Specifications</h3>
            <div className="specs-list">
              <div className="spec-row"><span className="spec-label">Material</span><span className="spec-value">Alloy (Silver-Plated)</span></div>
              <div className="spec-row"><span className="spec-label">Main Stone</span><span className="spec-value">Aqua Blue Crystal (Heart-shaped)</span></div>
              <div className="spec-row"><span className="spec-label">Accent Stones</span><span className="spec-value">Cubic Zirconia</span></div>
              <div className="spec-row"><span className="spec-label">Finish</span><span className="spec-value">Silver-tone</span></div>
              <div className="spec-row"><span className="spec-label">Pendant Size</span><span className="spec-value">22 mm × 19 mm</span></div>
              <div className="spec-row"><span className="spec-label">Chain Type</span><span className="spec-value">Link Chain</span></div>
              <div className="spec-row"><span className="spec-label">Closure</span><span className="spec-value">Lobster Clasp</span></div>
              <div className="spec-row"><span className="spec-label">Weight</span><span className="spec-value">Lightweight</span></div>
            </div>
          </div>
          <div className="product-actions">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              {cartMsg ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button className={`btn-wishlist-lg${wishlisted ? ' wishlisted' : ''}`} onClick={() => setWishlisted(!wishlisted)}>
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={wishlisted ? '#c9a96e' : 'none'} /></svg>
            </button>
          </div>
        </div>
      </section>

      <section className="recommendations">
        <div className="section-header"><h2 className="section-title">You May Also Like</h2></div>
        <div className="products-grid">
          <a href="/product-rose-amour" className="product-card">
            <div className="product-card-img"><img src="images/products/rose-amour-1.webp" alt="Rosé Amour Pendant"/></div>
            <div className="product-card-info"><p className="product-name">Rosé Amour Pendant</p><p className="product-price">₹549</p></div>
          </a>
          <a href="/product-ocean-solitaire" className="product-card">
            <div className="product-card-img"><img src="images/products/ocean-solitaire-1.webp" alt="Ocean Solitaire"/></div>
            <div className="product-card-info"><p className="product-name">Ocean Solitaire Pendant</p><p className="product-price">₹499</p></div>
          </a>
          <a href="/product-hamsa-pendant" className="product-card">
            <div className="product-card-img"><img src="images/products/hamsa-1.webp" alt="Hamsa Pendant"/></div>
            <div className="product-card-info"><p className="product-name">Hamsa Pendant Necklace</p><p className="product-price">₹549</p></div>
          </a>
          <a href="/product-zivara-bow" className="product-card">
            <div className="product-card-img"><img src="images/products/zivara-bow-1.webp" alt="Zivara Bow Set"/></div>
            <div className="product-card-info"><p className="product-name">Zivara Bow Set</p><p className="product-price">₹749</p></div>
          </a>
        </div>
      </section>
    </>
  );
}
