import { getProductUrl } from './productUtils';
import { resolveImageUrl } from './imageUrl';

export const FEATURED_BADGE_LABEL = 'Signature';

export const STATIC_PRODUCTS = [
  { href: '/product-rose-amour', img: 'images/products/rose-amour-1.jpeg', name: 'Rosé Amour Pendant', price: 549, category: 'Necklaces', badge: 'New' },
  { href: '/product-aqua-heart', img: 'images/products/aqua-heart-1.jpeg', name: 'Aqua Heart Pendant', price: 599, category: 'Necklaces', badge: null },
  { href: '/product-ocean-solitaire', img: 'images/products/ocean-solitaire-1.webp', name: 'Ocean Solitaire Pendant', price: 499, category: 'Necklaces', badge: 'Hot' },
  { href: '/product-hamsa-pendant', img: 'images/products/hamsa-1.webp', name: 'Hamsa Pendant Necklace', price: 549, category: 'Necklaces', badge: 'Signature' },
  { href: '/product-slim-crystal', img: 'images/products/slim-crystal-1.webp', name: 'Slim Crystal Band', price: 399, category: 'Rings', badge: 'New' },
  { href: '/product-solitaire-spark', img: 'images/products/solitaire-spark-1.webp', name: 'Solitaire Spark Ring', price: 349, category: 'Rings', badge: 'Hot' },
  { href: '/product-orbit-crystal', img: 'images/products/orbit-crystal-1.webp', name: 'Orbit Crystal Ring', price: 499, category: 'Rings', badge: null },
  { href: '/product-leaf-crystal', img: 'images/products/leaf-crystal-1.webp', name: 'Leaf Crystal Ring', price: 599, category: 'Rings', badge: null },
  { href: '/product-eterna-pearl', img: 'images/products/eterna-pearl-1.webp', name: 'Eterna Pearl Stud Earrings', price: 349, category: 'Earrings', badge: 'New' },
  { href: '/product-azura-square', img: 'images/products/azura-square-1.webp', name: 'Azura Square Drop Earrings', price: 249, category: 'Earrings', badge: 'Hot' },
  { href: '/product-rose-gold-square', img: 'images/products/rose-gold-earring-1.jpeg', name: 'Rose Gold Square Earring', price: 289, category: 'Earrings', badge: 'New' },
  { href: '/product-lume-bracelet', img: 'images/products/lume-bracelet-1.webp', name: 'Lumé Tennis Bracelet', price: 399, category: 'Bracelets', badge: 'Hot' },
  { href: '/product-lehar-bangle', img: 'images/products/lehar-bangle-4.jpeg', name: 'Lehar Bangle Set', price: 599, category: 'Bracelets', badge: 'New' },
  { href: '/product-classic-payal', img: 'images/products/classic-payal-1.jpeg', name: 'Classic Silver Payal', price: 299, category: 'Payals', badge: null },
  { href: '/product-ghunghroo-payal', img: 'images/products/ghunghroo-1.jpeg', name: 'Traditional Ghunghroo Payal', price: 399, category: 'Payals', badge: 'Hot' },
  { href: '/product-noor-set', img: 'images/products/noor-set-1.jpeg', name: 'Noor Solitaire Set', price: 749, category: 'Sets', badge: 'New' },
  { href: '/product-zivara-bow', img: 'images/products/zivara-bow-1.webp', name: 'Zivara Bow Set', price: 749, category: 'Sets', badge: null },
  { href: '/product-soleil-bloom', img: 'images/products/soleil-bloom-1.webp', name: 'Soleil Bloom Set', price: 699, category: 'Sets', badge: 'Hot' },
  { href: '/product-elvara-pear', img: 'images/products/elvara-pear-1.webp', name: 'Elvara Pear Halo Set', price: 799, category: 'Sets', badge: null },
  { href: '/product-triple-stone', img: 'images/7.jpeg', name: 'Triple Stone Elegance Ring', price: 1299, category: 'Rings', badge: null },
];

export function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString('en-IN')}`;
}

function primaryImage(product) {
  const image = product.images?.find((item) => item.isPrimary) || product.images?.[0];
  return resolveImageUrl(image?.url || image || 'images/products/rose-amour-1.jpeg');
}

export function normalizeProduct(product) {
  const href = product.slug ? `/product/${product.slug}` : getProductUrl(product.name);
  const badge = product.newArrival ? 'New' : product.hot ? 'Hot' : product.featured ? FEATURED_BADGE_LABEL : product.badge || null;
  return {
    id: product._id || product.id || product.slug || product.name,
    raw: product._id ? product : null,
    href: href === '#' ? '/category-all' : href,
    img: primaryImage(product),
    name: product.name,
    price: Number(product.price || 0),
    category: product.category?.name || product.category || 'SKYRA',
    badge,
  };
}

export function sortProducts(products, sort) {
  const list = [...products];
  switch (sort) {
    case 'price-low':
      return list.sort((a, b) => a.price - b.price);
    case 'price-high':
      return list.sort((a, b) => b.price - a.price);
    case 'name-az':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-za':
      return list.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return list;
  }
}

export function productKey(product) {
  return String(product?.id || product?.href || product?.name || '').toLowerCase();
}

function seededRank(key, seed) {
  const value = `${seed}:${key}`;
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getRandomRecommendations({
  products = STATIC_PRODUCTS,
  excludeProducts = [],
  excludeHrefs = [],
  excludeCategories = [],
  count = 4,
  seed = Math.random(),
} = {}) {
  const excluded = new Set([
    ...excludeProducts.map(productKey),
    ...excludeHrefs.map((href) => String(href).toLowerCase()),
  ]);
  const excludedCategories = new Set(excludeCategories.map((category) => String(category).toLowerCase()));
  const seen = new Set();

  return products
    .filter((product) => {
      const key = productKey(product);
      const category = String(product.category || '').toLowerCase();
      if (!key || excluded.has(key) || seen.has(key) || excludedCategories.has(category)) return false;
      seen.add(key);
      return true;
    })
    .map((product) => ({ product, rank: seededRank(productKey(product), seed) }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, count)
    .map((item) => item.product);
}
