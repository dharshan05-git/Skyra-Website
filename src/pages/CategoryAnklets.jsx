import { useEffect } from 'react';
import CategoryRecommendations from '../components/CategoryRecommendations.jsx';

export default function CategoryAnklets() {
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
      



<section className="category-hero category-hero--has-bg category-hero--anklets" style={{ backgroundImage: "url('images/ankle-header.png')" }}></section>

<section className="section">
  <div className="category-toolbar"><p className="category-count">Showing 2 products</p><select className="sort-select" id="sortSelect"><option value="">Sort By</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="newest">Newest First</option><option value="name-az">Name: A-Z</option></select></div>
  <div className="products-grid">
    <a href="/product-classic-payal" className="product-card" data-price="299" data-name="Classic Silver Payal" data-id="5">
      <div className="product-card-img"><img src="images/products/classic-payal-1.jpeg" alt="Classic Silver Payal"/><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Classic Silver Payal</p><p className="product-price">₹299</p></div>
    </a>
    <a href="/product-ghunghroo-payal" className="product-card" data-price="399" data-name="Traditional Ghunghroo Payal" data-id="6">
      <div className="product-card-img"><img src="images/products/ghunghroo-1.jpeg" alt="Traditional Ghunghroo Payal"/><span className="product-badge">Hot</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Traditional Ghunghroo Payal</p><p className="product-price">₹399</p></div>
    </a>
  </div>
</section>

<CategoryRecommendations excludeCategories={['Payals']} />




    </>
  );
}
