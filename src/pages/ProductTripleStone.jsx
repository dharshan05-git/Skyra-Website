import { useEffect } from 'react';

export default function ProductTripleStone() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) {
          el.classList.add('revealed');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <>
      



<section className="product-detail">
  <div className="product-gallery"><div className="product-main-img"><img src="images/7.jpeg" alt="Triple Stone Elegance Ring"/></div></div>
  <div className="product-info">
    <h1>Triple Stone Elegance Ring</h1>
    <p className="price">₹1,299</p>
    <p className="product-description">Designed for refined simplicity, the Triple Stone Elegance Ring showcases three round-cut zircon stones arranged in a balanced trio setting. The central stone delivers brilliant sparkle, while the two side stones enhance symmetry and shine. Crafted with a sleek, adjustable band and finished in a polished silver-tone, this piece offers both comfort and versatility.</p>
    <div className="product-specs">
      <h3>Specifications</h3>
      <div className="specs-list">
        <div className="spec-row"><span className="spec-label">Material</span><span className="spec-value">Alloy (Silver-Plated)</span></div>
        <div className="spec-row"><span className="spec-label">Stones</span><span className="spec-value">Cubic Zirconia (Zircon)</span></div>
        <div className="spec-row"><span className="spec-label">Cut</span><span className="spec-value">Round Cut</span></div>
        <div className="spec-row"><span className="spec-label">Setting</span><span className="spec-value">Triple stone (3-stone design)</span></div>
        <div className="spec-row"><span className="spec-label">Finish</span><span className="spec-value">Silver-tone</span></div>
        <div className="spec-row"><span className="spec-label">Size</span><span className="spec-value">Adjustable</span></div>
        <div className="spec-row"><span className="spec-label">Band Type</span><span className="spec-value">Open adjustable band</span></div>
        <div className="spec-row"><span className="spec-label">Weight</span><span className="spec-value">Lightweight</span></div>
      </div>
    </div>
    <div className="product-actions">
      <button className="btn-add-cart">Add to Cart</button>
      <button className="btn-wishlist-lg"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
    </div>
  </div>
</section>

<section className="recommendations"><div className="section-header"><h2 className="section-title">You May Also Like</h2></div><div className="products-grid">
  <a href="/product-slim-crystal" className="product-card"><div className="product-card-img"><img src="images/8.jpeg" alt="Slim Crystal Band"/></div><div className="product-card-info"><p className="product-name">Slim Crystal Band</p><p className="product-price">₹399</p></div></a>
  <a href="/product-solitaire-spark" className="product-card"><div className="product-card-img"><img src="images/9.jpeg" alt="Solitaire Spark Ring"/></div><div className="product-card-info"><p className="product-name">Solitaire Spark Ring</p><p className="product-price">₹349</p></div></a>
  <a href="/product-orbit-crystal" className="product-card"><div className="product-card-img"><img src="images/5.jpeg" alt="Orbit Crystal Ring"/></div><div className="product-card-info"><p className="product-name">Orbit Crystal Ring</p><p className="product-price">₹499</p></div></a>
  <a href="/product-leaf-crystal" className="product-card"><div className="product-card-img"><img src="images/6.jpeg" alt="Leaf Crystal Ring"/></div><div className="product-card-info"><p className="product-name">Leaf Crystal Ring</p><p className="product-price">₹599</p></div></a>
</div></section>




    </>
  );
}
