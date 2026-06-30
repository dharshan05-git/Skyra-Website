import ProductPage from './ProductPage';

export default function ProductNoorSet() {
  return <ProductPage
    name="Noor Solitaire Set"
    price="₹749"
    reviews="78"
    description="Radiance personified — the Noor Solitaire Set pairs a classic solitaire pendant with matching stud earrings, each featuring a brilliant round-cut zircon stone in a minimalist prong setting. Clean, confident, and eternally elegant, this set speaks to those who believe true beauty lies in simplicity."
    images={['images/products/noor-set-1.jpeg','images/products/noor-set-2.jpeg','images/products/noor-set-3.jpeg','images/products/noor-set-4.jpeg']}
    videoSrc={null}
    specs={[
      {label:'Set Includes', value:'Pendant + Stud Earrings'},
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Main Stone', value:'Solitaire Cubic Zirconia'},
      {label:'Setting', value:'Prong / Solitaire'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Chain', value:'Link Chain with Lobster Clasp'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
      {name:'Soleil Bloom Set', price:'₹699', img:'images/products/soleil-bloom-1.webp'},
      {name:'Zivara Bow Set', price:'₹749', img:'images/products/zivara-bow-1.webp'},
      {name:'Elvara Pear Halo Set', price:'₹799', img:'images/products/elvara-pear-1.webp'},
    ]}
  />;
}
