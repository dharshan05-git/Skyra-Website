import ProductPage from './ProductPage';

export default function ProductElvaraPear() {
  return <ProductPage
    name="Elvara Pear Halo Set"
    price="₹799"
    reviews="52"
    description="The Elvara Pear Halo Set is the pinnacle of jewellery elegance — a stunning pendant and earring duo featuring pear-shaped crystals surrounded by a glittering halo of zircon stones. The teardrop silhouette creates an elongating effect, making this set both flattering and unforgettable."
    images={['images/products/elvara-pear-1.webp','images/products/elvara-pear-2.webp','images/products/elvara-pear-3.jpeg','images/products/elvara-pear-4.jpeg','images/products/elvara-pear-5.jpeg']}
    videoSrc={null}
    specs={[
      {label:'Set Includes', value:'Pendant + Drop Earrings'},
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Main Stone', value:'Pear-shaped Crystal'},
      {label:'Setting', value:'Halo (surrounded by zircon)'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Chain', value:'Link Chain with Lobster Clasp'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Soleil Bloom Set', price:'₹699', img:'images/products/soleil-bloom-1.webp'},
      {name:'Zivara Bow Set', price:'₹749', img:'images/products/zivara-bow-1.webp'},
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
      {name:'Azura Square Drop Earrings', price:'₹249', img:'images/products/azura-square-1.webp'},
    ]}
  />;
}
