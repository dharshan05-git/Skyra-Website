import ProductPage from './ProductPage';

export default function ProductOrbitCrystal() {
  return <ProductPage
    name="Orbit Crystal Ring"
    price="₹499"
    reviews="87"
    description="Inspired by celestial motion, the Orbit Crystal Ring wraps a constellation of brilliant zircon stones in a flowing orbital band. The layered stone arrangement creates dimension and sparkle from every angle, making it a statement piece that elevates any look."
    images={['images/products/orbit-crystal-1.webp','images/products/orbit-crystal-2.webp','images/products/orbit-crystal-3.webp','images/products/orbit-crystal-4.webp']}
    videoSrc={null}
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Stones', value:'Cubic Zirconia'},
      {label:'Design', value:'Multi-stone orbital setting'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Size', value:'Adjustable'},
      {label:'Band Type', value:'Open adjustable band'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Solitaire Spark Ring', price:'₹349', img:'images/products/solitaire-spark-1.webp'},
      {name:'Slim Crystal Band', price:'₹399', img:'images/products/slim-crystal-1.webp'},
      {name:'Leaf Crystal Ring', price:'₹599', img:'images/products/leaf-crystal-1.webp'},
      {name:'Lumé Tennis Bracelet', price:'₹399', img:'images/products/lume-bracelet-1.webp'},
    ]}
  />;
}
