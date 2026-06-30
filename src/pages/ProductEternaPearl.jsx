import ProductPage from './ProductPage';

export default function ProductEternaPearl() {
  return <ProductPage
    name="Eterna Pearl Stud Earrings"
    price="₹349"
    reviews="156"
    description="Graceful and timeless, the Eterna Pearl Stud Earrings feature lustrous faux pearls set in a polished silver-tone cup. Pearls symbolise purity and elegance — these studs are the ultimate wardrobe essential, effortlessly elevating everything from office attire to evening wear."
    images={['images/products/eterna-pearl-1.webp','images/products/eterna-pearl-2.webp','images/products/eterna-pearl-3.webp','images/products/eterna-pearl-4.webp']}
    videoSrc={null}
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Main Stone', value:'Faux Pearl'},
      {label:'Style', value:'Stud Earrings'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Closure', value:'Push Back / Butterfly'},
      {label:'Size', value:'8 mm pearl'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Azura Square Drop Earrings', price:'₹249', img:'images/products/azura-square-1.webp'},
      {name:'Rose Gold Square Earring', price:'₹289', img:'images/products/rose-gold-earring-1.jpeg'},
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
      {name:'Lumé Tennis Bracelet', price:'₹399', img:'images/products/lume-bracelet-1.webp'},
    ]}
  />;
}
