import ProductPage from './ProductPage';

export default function ProductHamsaPendant() {
  return <ProductPage
    name="Hamsa Pendant Necklace"
    price="₹549"
    reviews="88"
    description="The Hamsa Pendant Necklace is a symbol of protection, luck, and positive energy. The intricate hand-shaped pendant is adorned with sparkling zircon stones and a delicate evil eye motif at the centre. Crafted in a polished silver-tone finish, it carries spiritual significance with timeless elegance."
    images={['images/products/hamsa-1.webp','images/products/hamsa-2.jpeg','images/products/hamsa-3.webp','images/products/hamsa-4.jpeg','images/products/hamsa-5.webp']}
    videoSrc="images/products/hamsa-video.mp4"
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Motif', value:'Hamsa / Hand of Fatima'},
      {label:'Stones', value:'Cubic Zirconia + Evil Eye'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Chain Type', value:'Link Chain'},
      {label:'Closure', value:'Lobster Clasp'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
      {name:'Ocean Solitaire Pendant', price:'₹499', img:'images/products/ocean-solitaire-1.webp'},
      {name:'Rosé Amour Pendant', price:'₹549', img:'images/products/rose-amour-1.webp'},
      {name:'Zivara Bow Set', price:'₹749', img:'images/products/zivara-bow-1.webp'},
    ]}
    isSignature={true}
  />;
}
