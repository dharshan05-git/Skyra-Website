import ProductPage from './ProductPage';

export default function ProductZivaraBow() {
  return <ProductPage
    name="Zivara Bow Set"
    price="₹749"
    reviews="43"
    description="Playful yet refined, the Zivara Bow Set features a charming bow-shaped pendant paired with matching stud earrings. Each piece is encrusted with sparkling zircon stones, creating a whimsical design that's both feminine and sophisticated. Perfect for gifting or everyday elegance."
    images={['images/products/zivara-bow-1.webp','images/products/zivara-bow-2.jpeg','images/products/zivara-bow-3.jpeg']}
    videoSrc={null}
    specs={[
      {label:'Set Includes', value:'Pendant + Stud Earrings'},
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Motif', value:'Bow'},
      {label:'Stones', value:'Cubic Zirconia'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Chain', value:'Link Chain with Lobster Clasp'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Soleil Bloom Set', price:'₹699', img:'images/products/soleil-bloom-1.webp'},
      {name:'Elvara Pear Halo Set', price:'₹799', img:'images/products/elvara-pear-1.webp'},
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
      {name:'Eterna Pearl Stud Earrings', price:'₹349', img:'images/products/eterna-pearl-1.webp'},
    ]}
  />;
}
