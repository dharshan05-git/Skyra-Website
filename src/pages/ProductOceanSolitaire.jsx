import ProductPage from './ProductPage';

export default function ProductOceanSolitaire() {
  return <ProductPage
    name="Ocean Solitaire Pendant"
    price="₹499"
    reviews="56"
    description="Deep, serene, and breathtaking — the Ocean Solitaire Pendant captures the essence of the sea in a single luminous stone. A solitaire aqua-blue crystal sits at the heart of a minimalist silver-tone setting, creating a bold yet refined look that draws the eye effortlessly."
    images={['images/products/ocean-solitaire-1.webp','images/products/ocean-solitaire-2.webp','images/products/ocean-solitaire-3.webp','images/products/ocean-solitaire-4.webp']}
    videoSrc={null}
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Main Stone', value:'Aqua Blue Solitaire Crystal'},
      {label:'Setting', value:'Prong / Solitaire'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Chain Type', value:'Link Chain'},
      {label:'Closure', value:'Lobster Clasp'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
      {name:'Rosé Amour Pendant', price:'₹549', img:'images/products/rose-amour-1.webp'},
      {name:'Hamsa Pendant Necklace', price:'₹549', img:'images/products/hamsa-1.webp'},
      {name:'Zivara Bow Set', price:'₹749', img:'images/products/zivara-bow-1.webp'},
    ]}
  />;
}
