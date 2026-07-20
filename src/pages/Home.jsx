import { useEffect, useRef, useState, useCallback } from 'react';
import { FEATURED_BADGE_LABEL, formatPrice, STATIC_PRODUCTS } from '../utils/storefrontData';

const HOME_BEST_SELLERS = [
  STATIC_PRODUCTS.find((product) => product.href === '/product-rose-amour'),
  STATIC_PRODUCTS.find((product) => product.href === '/product-hamsa-pendant'),
  STATIC_PRODUCTS.find((product) => product.href === '/product-ocean-solitaire'),
  STATIC_PRODUCTS.find((product) => product.href === '/product-lume-bracelet'),
].filter(Boolean);

export default function Home() {
  useEffect(() => {
    document.body.style.backgroundColor = '#faf3ee';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

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

  const [slide, setSlide] = useState(0);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    clearTimeout(timerRef.current);
    setSlide(idx);
  }, []);

  const prev = () => goTo(slide === 0 ? 1 : 0);
  const next = () => goTo(slide === 0 ? 1 : 0);

  useEffect(() => {
    if (slide === 0) {
      timerRef.current = setTimeout(() => setSlide(1), 5000);
    } else {
      const vid = videoRef.current;
      if (!vid) return;
      vid.currentTime = 0;
      vid.play().catch(() => {});
      const onEnd = () => setSlide(0);
      vid.addEventListener('ended', onEnd);
      return () => vid.removeEventListener('ended', onEnd);
    }
    return () => clearTimeout(timerRef.current);
  }, [slide]);

  return (
    <>
  <section className="hero hero-slider" id="hero">
    <div className={`hero-slide hero-slide--img${slide === 0 ? ' active' : ''}`}>
      <img
        src="/images/main-header.png"
        alt="SKYRA Hero"
        className="hero-bg-img"
      />
    </div>
    <div className={`hero-slide hero-slide--vid${slide === 1 ? ' active' : ''}`}>
      <video
        ref={videoRef}
        className="hero-video"
        muted
        playsInline
        preload="auto"
      >
        <source src="images/hero-video.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="hero-overlay"></div>
    <div className="hero-content">
      <p className="hero-tag">Timeless Elegance</p>
      <h1 className="hero-title">Jewellery That<br /><em>Tells Your Story</em></h1>
      <p className="hero-sub">Crafted in Sterling Silver.<br />Made to be cherished forever.</p>
      <a href="#categories" className="btn-primary">SHOP NOW <svg viewBox="0 0 24 24">
          <path d="M5 12h14M14 7l5 5-5 5" />
        </svg></a>
    </div>
    <div className="hero-dots">
      <button className={`hero-dot${slide === 0 ? ' active' : ''}`} onClick={() => goTo(0)} aria-label="Show image slide" />
      <button className={`hero-dot${slide === 1 ? ' active' : ''}`} onClick={() => goTo(1)} aria-label="Show video slide" />
    </div>
    <button className="hero-arrow hero-arrow--prev" onClick={prev} aria-label="Previous slide">
      <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
    </button>
    <button className="hero-arrow hero-arrow--next" onClick={next} aria-label="Next slide">
      <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
    </button>

  </section>
  <div className="trust-badges">
    <div className="trust-badge">
      <div className="trust-badge-icon"><svg viewBox="0 0 24 24">
          <rect x="1" y="3" width="15" height="13" rx="2" strokeWidth="1.2" fill="none" />
          <polyline points="16 8 20 8 23 11 23 16 16 16 16 8" strokeWidth="1.2" fill="none" />
          <circle cx="5.5" cy="18.5" r="2.5" strokeWidth="1.2" fill="none" />
          <circle cx="18.5" cy="18.5" r="2.5" strokeWidth="1.2" fill="none" />
        </svg></div>
      <div>
        <h4>Free Shipping</h4>
        <p>Above ₹549</p>
      </div>
    </div>
    <div className="trust-badge">
      <div className="trust-badge-icon"><svg viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            strokeWidth="1.2" fill="none" />
        </svg></div>
      <div>
        <h4> Sterling Silver</h4>
        <p>Authentic &amp; Hallmarked</p>
      </div>
    </div>
    <div className="trust-badge">
      <div className="trust-badge-icon"><svg viewBox="0 0 24 24">
          <polyline points="1 4 1 10 7 10" strokeWidth="1.2" fill="none" />
          <polyline points="23 20 23 14 17 14" strokeWidth="1.2" fill="none" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="1.2"
            fill="none" />
        </svg></div>
      <div>
        <h4>Easy Returns</h4>
        <p>3-5 Days Hassle Free</p>
      </div>
    </div>
    <div className="trust-badge">
      <div className="trust-badge-icon"><svg viewBox="0 0 24 24">
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            strokeWidth="1.2" fill="none" />
        </svg></div>
      <div>
        <h4>Lifetime Shine</h4>
        <p>Polish &amp; Shine Guarantee</p>
      </div>
    </div>
  </div>
  <section className="section" id="categories">
    <div className="section-header reveal">
      <h2 className="section-title" style={{color:'var(--maroon)'}}>SHOP BY CATEGORY</h2>
    </div>
    <div className="categories-grid reveal">
      <a href="/category-pendants" className="category-item">
        <div className="category-img"><img src="images/necklace-category.jpeg" alt="Necklaces" /></div>
        <p className="category-name">Necklaces</p>
      </a>
      <a href="/category-rings" className="category-item">
        <div className="category-img"><img src="images/ring-category.png" alt="Rings" /></div>
        <p className="category-name">Rings</p>
      </a>
      <a href="/category-earrings" className="category-item">
        <div className="category-img"><img src="images/earring-category.jpeg" alt="Earrings" /></div>
        <p className="category-name">Earrings</p>
      </a>
      <a href="/category-bracelets" className="category-item">
        <div className="category-img"><img src="images/bracelet-category.jpeg" alt="Bracelets" /></div>
        <p className="category-name">Bracelets</p>
      </a>
      <a href="/category-anklets" className="category-item">
        <div className="category-img"><img src="images/anklet-category.jpeg" alt="Payals" /></div>
        <p className="category-name">Payals</p>
      </a>
      <a href="/category-sets" className="category-item">
        <div className="category-img"><img src="images/sets-category.png" alt="Sets" /></div>
        <p className="category-name">Sets</p>
      </a>
    </div>
    <div className="btn-center reveal">
      <a href="/category-all" className="btn-primary">EXPLORE ALL <svg viewBox="0 0 24 24"
          style={{width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: '2'}}>
          <path d="M5 12h14M14 7l5 5-5 5" />
        </svg></a>
    </div>
  </section>
  <section className="section" id="bestsellers">
    <div className="section-header reveal">
      <h2 className="section-title" style={{color:'var(--maroon)'}}>BEST SELLERS</h2>
    </div>
    <div className="products-grid reveal">
      {HOME_BEST_SELLERS.map((product) => (
        <a key={product.id || product.name} href={product.href} className="product-card">
          <div className="product-card-img">
            <img src={product.img} alt={product.name} />
            {product.badge === 'Signature' || product.badge === FEATURED_BADGE_LABEL ? (
              <span className="product-badge product-badge--signature">{product.badge}</span>
            ) : product.badge ? (
              <span className="product-badge">{product.badge}</span>
            ) : null}
            <div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></div>
          </div>
          <div className="product-card-info">
            <p className="product-name">{product.name}</p>
            <p className="product-price">{formatPrice(product.price)}</p>
          </div>
        </a>
      ))}
    </div>
    <div className="btn-center reveal">
      <a href="/category-all" className="btn-primary">VIEW ALL PRODUCTS</a>
    </div>
  </section>
  <section className="gift-banner reveal">
    <div className="gift-banner-content">
      <p className="gift-banner-label">Our Signature Piece</p>
      <h2 className="gift-banner-title">Signature<br />Jewellery</h2>
      <p className="gift-banner-sub-slogan">Where every curve tells a story.</p>
      <p className="gift-banner-text">The Hamsa Pendant Necklace — a symbol of protection, luck, and positive energy, adorned with sparkling zircon stones. Timeless. Elegant. Unmistakably Skyra.</p>
      <a href="/product-hamsa-pendant" className="btn-white">SHOP NOW <svg viewBox="0 0 24 24"
          style={{width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: '2'}}>
          <path d="M5 12h14M14 7l5 5-5 5" />
        </svg></a>
    </div>
    <div className="gift-banner-img" style={{ position: 'relative' }}>
      <span className="signature-stamp">Signature</span>
      <img src="images/products/hamsa-1.webp" alt="Hamsa Pendant Necklace - Signature Jewellery" />
    </div>
  </section>
  <section className="why-section" id="why-skyra">
    <div className="section-header reveal">
      <h2 className="section-title" style={{color:'var(--maroon)'}}>WHY CHOOSE SKYRA?</h2>
    </div>
    <div className="why-grid reveal">
      <div className="why-card">
        <div className="why-icon"><svg viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              strokeWidth="1" fill="#5C1A1B" stroke="#5C1A1B" />
          </svg></div>
        <h4>Premium Quality</h4>
        <p>Finest  Sterling Silver for lasting beauty.</p>
      </div>
      <div className="why-card">
        <div className="why-icon"><svg viewBox="0 0 24 24">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              strokeWidth="1" fill="#5C1A1B" stroke="#5C1A1B" />
          </svg></div>
        <h4>Crafted with Care</h4>
        <p>Every piece is delicately crafted by skilled artisans.</p>
      </div>
      <div className="why-card">
        <div className="why-icon"><svg viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1" fill="#5C1A1B" stroke="#5C1A1B" />
          </svg></div>
        <h4>Hypoallergenic</h4>
        <p>Safe for sensitive skin. Nickel-free.</p>
      </div>
      <div className="why-card">
        <div className="why-icon"><svg viewBox="0 0 24 24">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              strokeWidth="1" fill="#5C1A1B" stroke="#5C1A1B" />
          </svg></div>
        <h4>Timeless Designs</h4>
        <p>Elegant pieces that never go out of style.</p>
      </div>
    </div>
  </section>
  <section className="instagram-section">
    <div className="section-header reveal">
      <p className="section-label">Customer Showcase</p>
      <h2 className="section-title" style={{color:'var(--maroon)'}}>SHOP THE LOOK</h2>
      <p className="instagram-email">info@skyrajewels.co.in</p>
    </div>
    <div className="instagram-grid reveal">
      <a href="/product-aqua-heart" className="instagram-item"><img src="images/products/aqua-heart-real.jpeg" alt="Aqua Heart Pendant" /></a>
      <a href="/product-rose-gold-square" className="instagram-item"><img src="images/products/rose-gold-earring-1.jpeg" alt="Rose Gold Square Earring" /></a>
      <a href="/product-solitaire-spark" className="instagram-item"><img src="images/products/solitaire-spark-4.jpeg" alt="Solitaire Spark Ring" /></a>
      <a href="/product-orbit-crystal" className="instagram-item"><img src="images/products/orbit-crystal-1.webp" alt="Orbit Crystal Ring" /></a>
      <a href="/product-lume-bracelet" className="instagram-item"><img src="images/products/lume-bracelet-3.jpeg" alt="Lumé Tennis Bracelet" /></a>
    </div>
  </section>
  

  

    </>
  );
}
