import { useEffect } from 'react';
import CategoryRecommendations from '../components/CategoryRecommendations.jsx';

export default function CategorySets() {
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
      



<section className="category-hero category-hero--has-bg category-hero--sets" style={{ backgroundImage: "url('/images/necklace-set-header.jpeg')" }}></section>

<section className="section">
  <div className="category-toolbar"><p className="category-count">Showing 4 products</p><select className="sort-select" id="sortSelect"><option value="">Sort By</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="newest">Newest First</option><option value="name-az">Name: A-Z</option></select></div>
  <div className="products-grid">
    <a href="/product-noor-set" className="product-card" data-price="749" data-name="Noor Solitaire Set" data-id="13">
      <div className="product-card-img"><img src="images/products/noor-set-1.jpeg" alt="Noor Solitaire Set"/><span className="product-badge">New</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Noor Solitaire Set</p><p className="product-price">₹749</p></div>
    </a>
    <a href="/product-zivara-bow" className="product-card" data-price="749" data-name="Zivara Bow Set" data-id="14">
      <div className="product-card-img"><img src="images/products/zivara-bow-1.webp" alt="Zivara Bow Set"/><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Zivara Bow Set</p><p className="product-price">₹749</p></div>
    </a>
    <a href="/product-soleil-bloom" className="product-card" data-price="699" data-name="Soleil Bloom Set" data-id="15">
      <div className="product-card-img"><img src="images/products/soleil-bloom-1.webp" alt="Soleil Bloom Set"/><span className="product-badge">Hot</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Soleil Bloom Set</p><p className="product-price">₹699</p></div>
    </a>
    <a href="/product-elvara-pear" className="product-card" data-price="799" data-name="Elvara Pear Halo Set" data-id="16">
      <div className="product-card-img"><img src="images/products/elvara-pear-1.webp" alt="Elvara Pear Halo Set"/><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Elvara Pear Halo Set</p><p className="product-price">₹799</p></div>
    </a>
  </div>
</section>

<CategoryRecommendations excludeCategories={['Sets']} />




    </>
  );
}
