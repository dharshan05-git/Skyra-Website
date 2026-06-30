import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { fetchProducts } from '../services/api';
import { formatPrice, normalizeProduct, sortProducts, STATIC_PRODUCTS } from '../utils/storefrontData';

const SORT_OPTIONS = [
  { value: '',           label: 'Sort By' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-az',   label: 'Name: A–Z' },
  { value: 'name-za',   label: 'Name: Z–A' },
  { value: 'newest',    label: 'Newest First' },
];

export default function CategoryAll() {
  const [sort, setSort] = useState('');
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('search')?.trim() || '';

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      reveals.forEach(el => {
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

    fetchProducts({ limit: 100, search: searchTerm })
      .then((data) => {
        const backendProducts = data.products || [];
        if (!ignore && backendProducts.length) {
          setProducts(backendProducts.map(normalizeProduct));
        }
      })
      .catch(() => {
        if (!ignore) setProducts(STATIC_PRODUCTS);
      });

    return () => {
      ignore = true;
    };
  }, [searchTerm]);

  const sorted = useMemo(() => {
    const searched = searchTerm
      ? products.filter((product) => {
          const haystack = `${product.name} ${product.category}`.toLowerCase();
          return haystack.includes(searchTerm.toLowerCase());
        })
      : products;
    return sortProducts(searched, sort);
  }, [products, searchTerm, sort]);

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
    <>
      <section className="section" style={{ paddingTop: '120px' }}>
        <div className="category-toolbar">
          <p className="category-count">
            Showing {sorted.length} products{searchTerm ? ` for "${searchTerm}"` : ''}
          </p>
          <select
            className="sort-select"
            id="sortSelectAll"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="products-grid">
          {sorted.map((p, i) => {
            const isWish = p.raw?._id ? isInWishlist(p.raw._id) : false;
            return (
            <a key={i} href={p.href} className="product-card">
              <div className="product-card-img">
                <img src={p.img} alt={p.name} />
                {p.badge && <span className="product-badge">{p.badge}</span>}
                <button
                  type="button"
                  className="product-wishlist"
                  onClick={(event) => handleWishlist(event, p)}
                  aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={isWish ? 'var(--maroon)' : 'none'} />
                  </svg>
                </button>
              </div>
              <div className="product-card-info">
                <p className="product-name">{p.name}</p>
                <p className="product-price">{formatPrice(p.price)}</p>
                <p style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '2px', letterSpacing: '0.5px' }}>
                  {p.category}
                </p>
              </div>
            </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
