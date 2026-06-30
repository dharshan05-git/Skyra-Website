import ProductPage from './ProductPage';

export default function ProductSoleilBloom() {
  return <ProductPage
    name="Soleil Bloom Set"
    price="₹699"
    reviews="67"
    description="The Soleil Bloom Set is a beautifully curated jewellery duo featuring a floral pendant and matching stud earrings. Each piece is adorned with delicate petal motifs and sparkling zircon accents, radiating warmth and elegance. Perfect as a gift or a treat for yourself."
    images={['images/products/soleil-bloom-1.webp','images/products/soleil-bloom-2.jpeg','images/products/soleil-bloom-3.jpeg','images/products/soleil-bloom-4.jpeg']}
    videoSrc="images/products/soleil-bloom-video.mp4"
    specs={[
      {label:'Set Includes', value:'Pendant + Stud Earrings'},
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Motif', value:'Floral / Bloom'},
      {label:'Stones', value:'Cubic Zirconia'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Chain', value:'Link Chain with Lobster Clasp'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Zivara Bow Set', price:'₹749', img:'images/products/zivara-bow-1.webp'},
      {name:'Elvara Pear Halo Set', price:'₹799', img:'images/products/elvara-pear-1.webp'},
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
      {name:'Eterna Pearl Stud Earrings', price:'₹349', img:'images/products/eterna-pearl-1.webp'},
    ]}
  />;
}
