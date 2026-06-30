import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { resolveImageUrl } from '../utils/imageUrl.js';
import { FEATURED_BADGE_LABEL } from '../utils/storefrontData.js';

const priceFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, loginWithGoogle } = useAuth();

  const slug = product.slug || '';
  const url = `/product/${slug}`;
  const img = product.images && product.images.length
    ? product.images.find((i) => i.isPrimary) || product.images[0]
    : null;
  const isWish = isInWishlist(product._id);
  const basePrice = Number(product.price || 0);
  const discount = Number(product.discount || 0);
  const salePrice = basePrice * (1 - discount / 100);
  const badge = product.badge || (product.newArrival ? 'New' : product.hot ? 'Hot' : product.featured ? FEATURED_BADGE_LABEL : null);
  const isSignatureBadge = badge === 'Signature' || badge === FEATURED_BADGE_LABEL;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      await loginWithGoogle().catch(() => {});
      return;
    }
    await toggleWishlist(product._id);
  };

  return (
    <Link to={url} className="product-card" style={{ position: 'relative' }}>
      <div className="product-card-img">
        {img
          ? <img src={resolveImageUrl(img.url)} alt={img.alt || product.name} />
          : <div className="product-card-placeholder" />
        }
        {badge && <span className={`product-badge${isSignatureBadge ? ' product-badge--signature' : ''}`}>{badge}</span>}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
          className="product-wishlist"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke={isWish ? 'var(--maroon)' : '#374151'}
            fill={isWish ? 'var(--maroon)' : 'none'}
            strokeWidth="2"
            style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="product-card-info">
        <p className="product-name">{product.name}</p>
        <div className="product-card-price">
          <span className="product-price">{priceFormat.format(salePrice)}</span>
          {discount > 0 && (
            <>
              <del style={{ color: '#999', fontSize: '13px', marginLeft: '6px' }}>{priceFormat.format(basePrice)}</del>
              <small style={{ color: 'var(--maroon)', fontWeight: '600', marginLeft: '4px' }}>{discount}% OFF</small>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
