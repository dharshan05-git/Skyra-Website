import { useEffect } from 'react';
import CategoryRecommendations from '../components/CategoryRecommendations.jsx';

export default function CategoryPendants() {
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
      



<section className="category-hero category-hero--has-bg category-hero--pendants category-hero--necklace" style={{ backgroundImage: "url('images/skyraaaa/necklace.png')" }}></section>

<section className="section">
  <div className="category-toolbar"><p className="category-count">Showing 4 products</p><select className="sort-select" id="sortSelect"><option value="">Sort By</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="newest">Newest First</option><option value="name-az">Name: A-Z</option></select></div>
  <div className="products-grid">
    <a href="/product-rose-amour" className="product-card" data-price="549" data-name="Rosé Amour Pendant" data-id="1">
      <div className="product-card-img"><img src="images/products/rose-amour-1.jpeg" alt="Rosé Amour Pendant"/><span className="product-badge">New</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Rosé Amour Pendant</p><p className="product-price">₹549</p></div>
    </a>
    <a href="/product-aqua-heart" className="product-card" data-price="599" data-name="Aqua Heart Pendant" data-id="11">
      <div className="product-card-img"><img src="images/products/aqua-heart-1.jpeg" alt="Aqua Heart Pendant"/><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Aqua Heart Pendant</p><p className="product-price">₹599</p></div>
    </a>
    <a href="/product-ocean-solitaire" className="product-card" data-price="499" data-name="Ocean Solitaire Pendant" data-id="12">
      <div className="product-card-img"><img src="images/products/ocean-solitaire-1.webp" alt="Ocean Solitaire Pendant"/><span className="product-badge">Hot</span><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Ocean Solitaire Pendant</p><p className="product-price">₹499</p></div>
    </a>
    <a href="/product-hamsa-pendant" className="product-card" data-price="549" data-name="Hamsa Pendant Necklace" data-id="19">
      <div className="product-card-img"><img src="images/products/hamsa-1.webp" alt="Hamsa Pendant Necklace"/><div className="product-wishlist"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>
      <div className="product-card-info"><p className="product-name">Hamsa Pendant Necklace</p><p className="product-price">₹549</p></div>
    </a>
  </div>
</section>

<CategoryRecommendations excludeCategories={['Necklaces']} />




    </>
  );
}
