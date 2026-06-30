import { useState, useEffect } from 'react';

export default function ProductRoseAmour() {
  const [selectedImg, setSelectedImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartMsg, setCartMsg] = useState(false);

  const images = [
    'images/products/rose-amour-1.jpeg',
    'images/products/rose-amour-2.webp',
    'images/products/rose-amour-3.webp',
    'images/products/rose-amour-4.webp',
  ];

  const mediaList = [
    ...images.map((img) => ({ type: 'image', src: img })),
    { type: 'video', src: 'images/products/rose-amour-video.mp4' }
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
              <img src={mediaList[selectedImg]?.src} alt="Rosé Amour Pendant" />
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
                  <img src={item.src} alt={`Rosé Amour view ${i + 1}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>Rosé Amour Pendant</h1>
          <p className="price">₹549</p>
          <p className="product-description">A graceful expression of love and elegance, the Rosé Amour Pendant combines a delicate heart silhouette with a sculpted rose motif. Accented with vibrant red stones and brilliant zircon crystals, the design reflects light with refined sparkle and clarity. Finished in a polished silver-tone, the pendant rests beautifully along the neckline.</p>
          <div className="product-specs">
            <h3>Specifications</h3>
            <div className="specs-list">
              <div className="spec-row"><span className="spec-label">Motif</span><span className="spec-value">Rose and Heart</span></div>
              <div className="spec-row"><span className="spec-label">Stones</span><span className="spec-value">Red Crystals &amp; High-quality Zircon (CZ)</span></div>
              <div className="spec-row"><span className="spec-label">Finish</span><span className="spec-value">Premium Silver-tone</span></div>
              <div className="spec-row"><span className="spec-label">Material</span><span className="spec-value">Alloy with Zircon Embellishments</span></div>
              <div className="spec-row"><span className="spec-label">Chain Type</span><span className="spec-value">Fine Link Chain</span></div>
              <div className="spec-row"><span className="spec-label">Closure</span><span className="spec-value">Lobster Clasp</span></div>
              <div className="spec-row"><span className="spec-label">Weight</span><span className="spec-value">Lightweight</span></div>
            </div>
          </div>
          <div className="product-actions">
            <button className="btn-add-cart" onClick={handleAddToCart}>{cartMsg ? '✓ Added to Cart!' : 'Add to Cart'}</button>
            <button className={`btn-wishlist-lg${wishlisted ? ' wishlisted' : ''}`} onClick={() => setWishlisted(!wishlisted)}>
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={wishlisted ? '#c9a96e' : 'none'} /></svg>
            </button>
          </div>
        </div>
      </section>

      <section className="recommendations">
        <div className="section-header"><h2 className="section-title">You May Also Like</h2></div>
        <div className="products-grid">
          <a href="/product-aqua-heart" className="product-card"><div className="product-card-img"><img src="images/products/aqua-heart-1.webp" alt="Aqua Heart Pendant"/></div><div className="product-card-info"><p className="product-name">Aqua Heart Pendant</p><p className="product-price">₹599</p></div></a>
          <a href="/product-ocean-solitaire" className="product-card"><div className="product-card-img"><img src="images/products/ocean-solitaire-1.webp" alt="Ocean Solitaire"/></div><div className="product-card-info"><p className="product-name">Ocean Solitaire Pendant</p><p className="product-price">₹499</p></div></a>
          <a href="/product-eterna-pearl" className="product-card"><div className="product-card-img"><img src="images/products/eterna-pearl-1.webp" alt="Eterna Pearl Studs"/></div><div className="product-card-info"><p className="product-name">Eterna Pearl Studs</p><p className="product-price">₹349</p></div></a>
          <a href="/product-hamsa-pendant" className="product-card"><div className="product-card-img"><img src="images/products/hamsa-1.webp" alt="Hamsa Pendant"/></div><div className="product-card-info"><p className="product-name">Hamsa Pendant Necklace</p><p className="product-price">₹549</p></div></a>
        </div>
      </section>
    </>
  );
}
