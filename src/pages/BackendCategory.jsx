import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { fetchProducts } from '../services/api';
import { FEATURED_BADGE_LABEL, formatPrice, getRandomRecommendations, normalizeProduct, sortProducts, STATIC_PRODUCTS } from '../utils/storefrontData';

const SORT_OPTIONS = [
  { value: '', label: 'Sort By' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name-az', label: 'Name: A-Z' },
  { value: 'name-za', label: 'Name: Z-A' },
];

const HERO_IMAGES = {
  anklets: 'images/skyraaaa/anklet.png',
  bracelets: 'images/skyraaaa/bracelets.png',
  earrings: 'images/skyraaaa/earrings.png',
  pendants: 'images/skyraaaa/necklace.png',
  rings: 'images/skyraaaa/rings.png',
  sets: '/images/necklace-set-header.jpeg',
};

function ProductGrid({ products }) {
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleWishlist = async (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    if (!product.raw?._id) return;
    if (!isAuthenticated) {
      await loginWithGoogle().catch(() => {});
      return;
    }
    await toggleWishlist(product.raw._id);
  };

  return (
    <div className="products-grid">
      {products.map((product) => {
        const isWish = product.raw?._id ? isInWishlist(product.raw._id) : false;
        return (
        <a key={product.id || product.href} href={product.href} className="product-card">
          <div className="product-card-img">
            <img src={product.img} alt={product.name} />
            {product.badge && <span className={`product-badge${product.badge === 'Signature' || product.badge === FEATURED_BADGE_LABEL ? ' product-badge--signature' : ''}`}>{product.badge}</span>}
            <button
              type="button"
              className="product-wishlist"
              onClick={(event) => handleWishlist(event, product)}
              aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={isWish ? 'var(--maroon)' : 'none'} />
              </svg>
            </button>
          </div>
          <div className="product-card-info">
            <p className="product-name">{product.name}</p>
            <p className="product-price">{formatPrice(product.price)}</p>
          </div>
        </a>
        );
      })}
    </div>
  );
}

export default function BackendCategory({ categorySlug, categoryName, fallback }) {
  const [sort, setSort] = useState('');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [failed, setFailed] = useState(false);
  const [recommendationSeed, setRecommendationSeed] = useState(() => Math.random());

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) {
          el.classList.add('revealed');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      fetchProducts({ limit: 100, category: categorySlug }),
      fetchProducts({ limit: 100 }),
    ])
      .then(([categoryData, allData]) => {
        if (ignore) return;
        setProducts((categoryData.products || []).map(normalizeProduct));
        setAllProducts((allData.products || []).map(normalizeProduct));
        setRecommendationSeed(Math.random());
      })
      .catch(() => {
        if (!ignore) setFailed(true);
      });

    return () => {
      ignore = true;
    };
  }, [categorySlug]);

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);
  const recommendations = useMemo(() => {
    return getRandomRecommendations({
      products: allProducts.length ? allProducts : STATIC_PRODUCTS,
      excludeProducts: products,
      seed: recommendationSeed,
    });
  }, [allProducts, products, recommendationSeed]);

  if (failed && fallback) return fallback;

  return (
    <>
      <section
        className={`category-hero category-hero--has-bg category-hero--${categorySlug}${categorySlug === 'pendants' ? ' category-hero--necklace' : ''}`}
        style={{ backgroundImage: `url('${HERO_IMAGES[categorySlug] || HERO_IMAGES.pendants}')` }}
      />

      <section className="section">
        <div className="category-toolbar">
          <p className="category-count">Showing {sorted.length} products</p>
          <select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {sorted.length ? <ProductGrid products={sorted} /> : (
          <div className="category-count" style={{ padding: '40px 0' }}>
            No active {categoryName.toLowerCase()} products found.
          </div>
        )}
      </section>

      <section className="recommendations reveal">
        <div className="section-header"><h2 className="section-title">You May Also Like</h2></div>
        <ProductGrid products={recommendations} />
      </section>
    </>
  );
}
