import ProductPage from './ProductPage';

export default function ProductClassicPayal() {
  return <ProductPage
    name="Classic Silver Payal"
    price="₹299"
    reviews="132"
    description="The Classic Silver Payal is a timeless anklet that celebrates traditional Indian craft with a modern sensibility. Delicate silver-tone links with gentle charm accents create a soft, melodic movement with every step. Perfect for festive occasions, casual wear, or gifting a loved one."
    images={['images/products/classic-payal-1.jpeg','images/products/classic-payal-2.jpeg','images/products/classic-payal-3.jpeg','images/products/classic-payal-4.jpeg']}
    videoSrc={null}
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Style', value:'Anklet / Payal'},
      {label:'Design', value:'Classic link with charms'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Closure', value:'Lobster Clasp'},
      {label:'Length', value:'Adjustable'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Traditional Ghunghroo Payal', price:'₹399', img:'images/products/ghunghroo-1.jpeg'},
      {name:'Lehar Bangle Set', price:'₹599', img:'images/products/lehar-bangle-1.webp'},
      {name:'Lumé Tennis Bracelet', price:'₹399', img:'images/products/lume-bracelet-1.webp'},
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
    ]}
  />;
}
