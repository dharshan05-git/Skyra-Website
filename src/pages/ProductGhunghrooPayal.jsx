import ProductPage from './ProductPage';

export default function ProductGhunghrooPayal() {
  return <ProductPage
    name="Traditional Ghunghroo Payal"
    price="₹399"
    reviews="97"
    description="A tribute to Indian tradition, the Traditional Ghunghroo Payal features tiny bell-shaped charms that produce a soft, melodic sound with every step. The classic ghunghroo design is a beloved symbol of grace and celebration, worn at festivals, weddings, and dance performances alike."
    images={['images/products/ghunghroo-1.jpeg','images/products/ghunghroo-2.jpeg','images/products/ghunghroo-3.jpeg','images/products/ghunghroo-4.jpeg']}
    videoSrc={null}
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Style', value:'Ghunghroo Payal / Anklet'},
      {label:'Design', value:'Bell charms on chain'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Closure', value:'Lobster Clasp'},
      {label:'Length', value:'Adjustable'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Classic Silver Payal', price:'₹299', img:'images/products/classic-payal-1.jpeg'},
      {name:'Lehar Bangle Set', price:'₹599', img:'images/products/lehar-bangle-1.webp'},
      {name:'Eterna Pearl Stud Earrings', price:'₹349', img:'images/products/eterna-pearl-1.webp'},
      {name:'Lumé Tennis Bracelet', price:'₹399', img:'images/products/lume-bracelet-1.webp'},
    ]}
  />;
}
