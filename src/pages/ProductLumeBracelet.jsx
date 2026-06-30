import ProductPage from './ProductPage';

export default function ProductLumeBracelet() {
  return <ProductPage
    name="Lumé Tennis Bracelet"
    price="₹399"
    reviews="203"
    description="Classic and timeless, the Lumé Tennis Bracelet features a continuous row of brilliant round-cut zircon stones set in a polished silver-tone setting. The flexible linked design ensures a comfortable fit that drapes elegantly around the wrist, catching light with every movement."
    images={['images/products/lume-bracelet-1.webp','images/products/lume-bracelet-2.webp','images/products/lume-bracelet-3.webp']}
    videoSrc={null}
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Stones', value:'Cubic Zirconia (Round Cut)'},
      {label:'Style', value:'Tennis Bracelet'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Closure', value:'Box Clasp'},
      {label:'Length', value:'Adjustable'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Lehar Bangle Set', price:'₹599', img:'images/products/lehar-bangle-1.webp'},
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
      {name:'Solitaire Spark Ring', price:'₹349', img:'images/products/solitaire-spark-1.webp'},
      {name:'Eterna Pearl Stud Earrings', price:'₹349', img:'images/products/eterna-pearl-1.webp'},
    ]}
  />;
}
