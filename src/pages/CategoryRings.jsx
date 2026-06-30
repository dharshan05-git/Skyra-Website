import { useEffect } from 'react';
import CategoryRecommendations from '../components/CategoryRecommendations.jsx';

export default function CategoryRings() {
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
      



<section className="category-hero category-hero--has-bg category-hero--rings" style={{ backgroundImage: "url('images/ring-header.png')" }}></section>

<section className="section">
  <div className="category-toolbar">
    <p className="category-count">Showing 4 products</p>
    <select className="sort-select" id="sortSelect">
      <option value="">Sort By</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="newest">Newest First</option>
      <option value="name-az">Name: A-Z</option>
    </select>
  </div>
  <div className="products-grid">
    <a href="/product-slim-crystal" className="product-card" data-price="399" data-name="Slim Crystal Band" data-id="7">
      <div className="product-card-img"><img src="images/products/slim-crystal-1.webp" alt="Slim Crystal Band"/><span className="product-badge">New</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Slim Crystal Band</p><p className="product-price">₹399</p></div>
    </a>
    <a href="/product-solitaire-spark" className="product-card" data-price="349" data-name="Solitaire Spark Ring" data-id="8">
      <div className="product-card-img"><img src="images/products/solitaire-spark-1.webp" alt="Solitaire Spark Ring"/><span className="product-badge">Hot</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Solitaire Spark Ring</p><p className="product-price">₹349</p></div>
    </a>
    <a href="/product-orbit-crystal" className="product-card" data-price="499" data-name="Orbit Crystal Ring" data-id="9">
      <div className="product-card-img"><img src="images/products/orbit-crystal-1.webp" alt="Orbit Crystal Ring"/><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Orbit Crystal Ring</p><p className="product-price">₹499</p></div>
    </a>
    <a href="/product-leaf-crystal" className="product-card" data-price="599" data-name="Leaf Crystal Ring" data-id="10">
      <div className="product-card-img"><img src="images/products/leaf-crystal-1.webp" alt="Leaf Crystal Ring"/><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Leaf Crystal Ring</p><p className="product-price">₹599</p></div>
    </a>
  </div>
</section>
<CategoryRecommendations excludeCategories={['Rings']} />




    </>
  );
}
