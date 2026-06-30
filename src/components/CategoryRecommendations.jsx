import { useMemo, useState } from 'react';
import { FEATURED_BADGE_LABEL, formatPrice, getRandomRecommendations, STATIC_PRODUCTS } from '../utils/storefrontData';

export default function CategoryRecommendations({ excludeCategories = [], excludeHrefs = [] }) {
  const [seed] = useState(() => Math.random());
  const recommendations = useMemo(() => getRandomRecommendations({
    products: STATIC_PRODUCTS,
    excludeCategories,
    excludeHrefs,
    seed,
  }), [excludeCategories, excludeHrefs, seed]);

  return (
    <section className="recommendations reveal">
      <div className="section-header"><h2 className="section-title">You May Also Like</h2></div>
      <div className="products-grid">
        {recommendations.map((product) => (
          <a href={product.href} className="product-card" key={product.href}>
            <div className="product-card-img">
              <img src={product.img} alt={product.name} />
              {product.badge && (
                <span className={`product-badge${product.badge === FEATURED_BADGE_LABEL ? ' product-badge--signature' : ''}`}>
                  {product.badge}
                </span>
              )}
            </div>
            <div className="product-card-info">
              <p className="product-name">{product.name}</p>
              <p className="product-price">{formatPrice(product.price)}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
