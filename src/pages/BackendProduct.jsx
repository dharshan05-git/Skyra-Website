import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductBySlug, fetchProducts } from '../services/api';
import { formatPrice, normalizeProduct, STATIC_PRODUCTS } from '../utils/storefrontData';
import ProductPage from './ProductPage';

function productMedia(product) {
  const images = product.images?.map((image) => image.url || image).filter(Boolean) || [];
  return images.length ? images : ['images/products/rose-amour-1.jpeg'];
}

function productSpecs(product) {
  if (Array.isArray(product.specifications) && product.specifications.length) {
    return product.specifications;
  }

  return [
    { label: 'Category', value: product.category?.name || 'SKYRA' },
    { label: 'Availability', value: Number(product.stock || 0) > 0 ? 'In stock' : 'Made to order' },
    { label: 'Material', value: 'Sterling Silver' },
  ];
}

export default function BackendProduct({ slug: routeSlug, fallback = null }) {
  const params = useParams();
  const legacySlug = params['*']?.replace(/^product-/, '');
  const slug = routeSlug || params.slug || legacySlug;
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState(STATIC_PRODUCTS.slice(0, 4));
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    fetchProductBySlug(slug)
      .then((backendProduct) => {
        if (!ignore) setProduct(backendProduct);
      })
      .catch(() => {
        if (!ignore) setError('Product not found.');
      });

    fetchProducts({ limit: 4 })
      .then((data) => {
        if (!ignore && data.products?.length) {
          setRecommendations(data.products.map(normalizeProduct));
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [slug]);

  const pageProps = useMemo(() => {
    if (!product) return null;
    return {
      name: product.name,
      price: formatPrice(product.price),
      reviews: '',
      description: product.description || 'A timeless SKYRA piece crafted for everyday elegance.',
      specs: productSpecs(product),
      images: productMedia(product),
      recommendations: recommendations.map((item) => ({ ...item, price: formatPrice(item.price) })),
      isSignature: product.tags?.includes('signature') || product.featured,
      product,
    };
  }, [product, recommendations]);

  if (error) {
    if (fallback) return fallback;

    return (
      <section className="section" style={{ paddingTop: '140px', textAlign: 'center' }}>
        <h1>{error}</h1>
        <a href="/category-all" className="btn-primary">View Products</a>
      </section>
    );
  }

  if (!pageProps) {
    return (
      <section className="section" style={{ paddingTop: '140px', textAlign: 'center' }}>
        <p className="category-count">Loading product...</p>
      </section>
    );
  }

  return <ProductPage {...pageProps} />;
}
