import ProductPage from './ProductPage';

export default function ProductSlimCrystal() {
  return <ProductPage
    name="Slim Crystal Band"
    price="₹399"
    reviews="91"
    description="A clean, everyday piece, the Slim Crystal Band features a fine row of zircon stones set along a sleek band. It adds just the right amount of shine without feeling heavy or overdone. Lightweight and adjustable — perfect solo or stacked."
    images={['images/products/slim-crystal-1.webp','images/products/slim-crystal-2.webp','images/products/slim-crystal-3.jpeg','images/products/slim-crystal-4.jpeg']}
    videoSrc="images/products/slim-crystal-video.mp4"
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Stones', value:'Cubic Zirconia (Zircon)'},
      {label:'Cut', value:'Round Cut'},
      {label:'Design', value:'Slim band with stone setting'},
      {label:'Color', value:'White / Silver'},
      {label:'Size', value:'Adjustable'},
      {label:'Band Type', value:'Open adjustable band'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {href:'/product-solitaire-spark', name:'Solitaire Spark Ring', price:'₹349', img:'images/products/solitaire-spark-1.webp'},
      {href:'/product-orbit-crystal', name:'Orbit Crystal Ring', price:'₹499', img:'images/products/orbit-crystal-1.jpeg'},
      {href:'/product-leaf-crystal', name:'Leaf Crystal Ring', price:'₹599', img:'images/products/leaf-crystal-1.webp'},
      {href:'/product-lume-bracelet', name:'Lumé Tennis Bracelet', price:'₹399', img:'images/products/lume-bracelet-1.webp'},
    ]}
  />;
}
