import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDatabase, disconnectDatabase } from './src/config/database.js';
import { env } from './src/config/env.js';
import Admin from './src/models/Admin.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import ShippingSettings from './src/models/ShippingSettings.js';
import SiteSettings from './src/models/SiteSettings.js';
import User from './src/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, '..', 'src');

const categories = [
  { name: 'Necklaces', slug: 'pendants' },
  { name: 'Rings', slug: 'rings' },
  { name: 'Earrings', slug: 'earrings' },
  { name: 'Bracelets', slug: 'bracelets' },
  { name: 'Payals', slug: 'anklets' },
  { name: 'Sets', slug: 'sets' },
];

const categorySlugByName = {
  Necklaces: 'pendants',
  Rings: 'rings',
  Earrings: 'earrings',
  Bracelets: 'bracelets',
  Payals: 'anklets',
  Sets: 'sets',
};

function parseStaticProductMeta() {
  const file = path.join(frontendRoot, 'utils', 'storefrontData.js');
  if (!fs.existsSync(file)) return new Map();
  const text = fs.readFileSync(file, 'utf8');
  const meta = new Map();
  const productPattern = /\{\s*href:\s*'\/product-([^']+)'[\s\S]*?img:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?price:\s*(\d+)[\s\S]*?category:\s*'([^']+)'[\s\S]*?badge:\s*([^}\n]+)\}/g;
  for (const match of text.matchAll(productPattern)) {
    meta.set(match[1], {
      slug: match[1],
      primaryImage: match[2],
      name: match[3],
      price: Number(match[4]),
      categoryName: match[5],
      featured: /New|Hot|Signature/.test(match[6]),
    });
  }
  return meta;
}

function decodeText(value = '') {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function staticSlugFromFile(file) {
  return file
    .replace(/^Product/, '')
    .replace(/\.jsx$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseStaticProducts() {
  const pagesDir = path.join(frontendRoot, 'pages');
  if (!fs.existsSync(pagesDir)) return [];
  const meta = parseStaticProductMeta();
  return fs.readdirSync(pagesDir)
    .filter((file) => /^Product.*\.jsx$/.test(file) && file !== 'ProductPage.jsx')
    .map((file) => {
      const text = fs.readFileSync(path.join(pagesDir, file), 'utf8');
      const slug = staticSlugFromFile(file);
      const productMeta = meta.get(slug) || {};
      const name = text.match(/name="([^"]+)"/)?.[1] || text.match(/<h1>([^<]+)<\/h1>/)?.[1] || productMeta.name;
      const priceText = text.match(/price="₹?([0-9,]+)"/)?.[1] || text.match(/<p className="price">₹?([0-9,]+)<\/p>/)?.[1];
      const description = decodeText(text.match(/description="([^"]+)"/)?.[1] || text.match(/<p className="product-description">([\s\S]*?)<\/p>/)?.[1] || '');
      const specifications = [];
      for (const match of text.matchAll(/\{label:'([^']+)', value:'([^']+)'\}/g)) {
        specifications.push({ label: decodeText(match[1]), value: decodeText(match[2]) });
      }
      for (const match of text.matchAll(/spec-label[^>]*>([^<]+)<[\s\S]*?spec-value[^>]*>([\s\S]*?)<\/span>/g)) {
        specifications.push({ label: decodeText(match[1]), value: decodeText(match[2]) });
      }
      const imageSource = text.match(/images=\{\[([\s\S]*?)\]\}/)?.[1] || text.match(/const images = \[([\s\S]*?)\]/)?.[1] || '';
      const images = [...imageSource.matchAll(/'([^']+)'/g)].map((match, index) => ({ url: `/${match[1].replace(/^\/+/, '')}`, alt: name, isPrimary: index === 0 }));
      if (!images.length && productMeta.primaryImage) images.push({ url: `/${productMeta.primaryImage.replace(/^\/+/, '')}`, alt: name, isPrimary: true });
      return {
        slug,
        name,
        description,
        price: priceText ? Number(priceText.replace(/,/g, '')) : Number(productMeta.price || 0),
        categorySlug: categorySlugByName[productMeta.categoryName] || 'pendants',
        featured: Boolean(productMeta.featured),
        aliasNames: [productMeta.name].filter(Boolean),
        stock: 10,
        images,
        specifications,
      };
    })
    .filter((product) => product.name && product.price > 0);
}

async function seed() {
  await connectDatabase();
  const categoriesBySlug = new Map();
  const staticProducts = parseStaticProducts();
  for (const [sortOrder, category] of categories.entries()) {
    const saved = await Category.findOneAndUpdate(
      { slug: category.slug },
      { $set: { name: category.name, slug: category.slug, sortOrder, active: true, archived: false }, $unset: { archivedAt: 1 } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    categoriesBySlug.set(saved.slug, saved);
  }

  for (const product of staticProducts) {
    const category = categoriesBySlug.get(product.categorySlug) || categoriesBySlug.get('pendants');
    await Product.findOneAndUpdate(
      { slug: product.slug },
      {
        $set: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          category: category._id,
          price: product.price,
          stock: product.stock,
          featured: product.featured,
          active: true,
          archived: false,
          images: product.images,
          specifications: product.specifications,
        },
        $unset: { archivedAt: 1 },
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  for (const product of staticProducts) {
    const names = [...new Set([product.name, ...(product.aliasNames || [])].filter(Boolean))];
    await Product.updateMany(
      {
        slug: { $ne: product.slug },
        archived: { $ne: true },
        $or: [
          { name: { $in: names } },
          { slug: { $regex: `^${escapeRegex(product.slug)}-` } },
        ],
      },
      { $set: { active: false, archived: true, archivedAt: new Date() } }
    );
  }

  await ShippingSettings.findOneAndUpdate({ key: 'default' }, { $setOnInsert: { key: 'default', fixedShippingRate: 99, freeShippingEnabled: true, freeShippingThreshold: 1000 } }, { upsert: true, setDefaultsOnInsert: true });
  await SiteSettings.findOneAndUpdate({ key: 'default' }, { $setOnInsert: { key: 'default', storeName: 'SKYRA', taxRate: 0 } }, { upsert: true, setDefaultsOnInsert: true });
  if (env.ADMIN_SEED_EMAIL && env.ADMIN_SEED_FIREBASE_UID) {
    const user = await User.findOneAndUpdate(
      { firebaseUid: env.ADMIN_SEED_FIREBASE_UID },
      { email: env.ADMIN_SEED_EMAIL.toLowerCase(), name: 'SKYRA Administrator', active: true },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    await Admin.findOneAndUpdate({ user: user._id }, { role: 'superadmin', active: true }, { upsert: true, runValidators: true, setDefaultsOnInsert: true });
  }
  console.log('Seed completed');
}

seed().catch((error) => { console.error('Seed failed', error); process.exitCode = 1; }).finally(disconnectDatabase);
