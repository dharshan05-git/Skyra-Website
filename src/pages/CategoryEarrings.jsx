import { useEffect } from 'react';
import CategoryRecommendations from '../components/CategoryRecommendations.jsx';

export default function CategoryEarrings() {
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
      



<section className="category-hero category-hero--has-bg category-hero--earrings" style={{ backgroundImage: "url('images/earring-header.png')" }}></section>

<section className="section">
  <div className="category-toolbar"><p className="category-count">Showing 3 products</p><select className="sort-select" id="sortSelect"><option value="">Sort By</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="newest">Newest First</option><option value="name-az">Name: A-Z</option></select></div>
  <div className="products-grid">
    <a href="/product-eterna-pearl" className="product-card" data-price="349" data-name="Eterna Pearl Stud Earrings" data-id="2">
      <div className="product-card-img"><img src="images/products/eterna-pearl-1.webp" alt="Eterna Pearl Stud Earrings"/><span className="product-badge">New</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Eterna Pearl Stud Earrings</p><p className="product-price">₹349</p></div>
    </a>
    <a href="/product-azura-square" className="product-card" data-price="249" data-name="Azura Square Drop Earrings" data-id="17">
      <div className="product-card-img"><img src="images/products/azura-square-1.webp" alt="Azura Square Drop Earrings"/><span className="product-badge">Hot</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Azura Square Drop Earrings</p><p className="product-price">₹249</p></div>
    </a>
    <a href="/product-rose-gold-square" className="product-card" data-price="289" data-name="Rose Gold Square Earring" data-id="4">
      <div className="product-card-img"><img src="images/products/rose-gold-earring-1.jpeg" alt="Rose Gold Square Earring"/><span className="product-badge">New</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Rose Gold Square Earring</p><p className="product-price">₹289</p></div>
    </a>
  </div>
</section>

<CategoryRecommendations excludeCategories={['Earrings']} />




    </>
  );
}
