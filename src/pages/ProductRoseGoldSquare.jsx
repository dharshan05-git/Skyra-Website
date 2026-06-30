import { useState, useEffect } from 'react';

export default function ProductRoseGoldSquare() {
  const [selectedImg, setSelectedImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartMsg, setCartMsg] = useState(false);

  const images = [
    'images/products/rose-gold-earring-1.jpeg',
    'images/products/rose-gold-earring-2.jpeg',
    'images/products/rose-gold-earring-3.jpeg',
    'images/products/rose-gold-earring-4.jpeg',
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
            <img src={images[selectedImg]} alt="Rose Gold Square Earring" />
          </div>
          <div className="product-thumbnails">
            {images.map((img, i) => (
              <div
                key={i}
                className={`product-thumb${selectedImg === i ? ' active' : ''}`}
                onClick={() => setSelectedImg(i)}
              >
                <img src={img} alt={`Rose Gold Square Earring view ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>Rose Gold Square Earring</h1>
          <p className="price">₹289</p>
          <p className="product-description">
            Sleek, modern, and effortlessly glamorous — the Rose Gold Square Earring features bold geometric square drops finished in warm rose gold. The clean lines and lustrous finish make these earrings a standout choice for both casual and formal occasions. Lightweight and comfortable to wear all day long.
          </p>
          <div className="product-specs">
            <h3>Specifications</h3>
            <div className="specs-list">
              <div className="spec-row"><span className="spec-label">Material</span><span className="spec-value">Alloy (Rose Gold Plated)</span></div>
              <div className="spec-row"><span className="spec-label">Style</span><span className="spec-value">Square Drop Earrings</span></div>
              <div className="spec-row"><span className="spec-label">Finish</span><span className="spec-value">Rose Gold Tone</span></div>
              <div className="spec-row"><span className="spec-label">Closure</span><span className="spec-value">Push Back / Butterfly</span></div>
              <div className="spec-row"><span className="spec-label">Size</span><span className="spec-value">Medium Drop</span></div>
              <div className="spec-row"><span className="spec-label">Weight</span><span className="spec-value">Lightweight</span></div>
              <div className="spec-row"><span className="spec-label">Occasion</span><span className="spec-value">Casual, Formal, Festive</span></div>
            </div>
          </div>
          <div className="product-actions">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              {cartMsg ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              className={`btn-wishlist-lg${wishlisted ? ' wishlisted' : ''}`}
              onClick={() => { setWishlisted(!wishlisted); }}
              title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                   fill={wishlisted ? '#c9a96e' : 'none'} />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="recommendations">
        <div className="section-header"><h2 className="section-title">You May Also Like</h2></div>
        <div className="products-grid">
          <a href="/product-eterna-pearl" className="product-card">
            <div className="product-card-img"><img src="images/products/eterna-pearl-1.webp" alt="Eterna Pearl Stud Earrings"/></div>
            <div className="product-card-info"><p className="product-name">Eterna Pearl Stud Earrings</p><p className="product-price">₹349</p></div>
          </a>
          <a href="/product-azura-square" className="product-card">
            <div className="product-card-img"><img src="images/products/azura-square-1.webp" alt="Azura Square Drop Earrings"/></div>
            <div className="product-card-info"><p className="product-name">Azura Square Drop Earrings</p><p className="product-price">₹249</p></div>
          </a>
          <a href="/product-lume-bracelet" className="product-card">
            <div className="product-card-img"><img src="images/products/lume-bracelet-1.webp" alt="Lumé Tennis Bracelet"/></div>
            <div className="product-card-info"><p className="product-name">Lumé Tennis Bracelet</p><p className="product-price">₹399</p></div>
          </a>
          <a href="/product-aqua-heart" className="product-card">
            <div className="product-card-img"><img src="images/products/aqua-heart-1.webp" alt="Aqua Heart Pendant"/></div>
            <div className="product-card-info"><p className="product-name">Aqua Heart Pendant</p><p className="product-price">₹599</p></div>
          </a>
        </div>
      </section>
    </>
  );
}
