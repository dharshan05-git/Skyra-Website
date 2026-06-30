import ProductPage from './ProductPage';

export default function ProductLeafCrystal() {
  return <ProductPage
    name="Leaf Crystal Ring"
    price="₹599"
    reviews="74"
    description="Delicate and nature-inspired, the Leaf Crystal Ring features an open leaf motif adorned with sparkling zircon stones. The organic silhouette gives this ring a distinctive character — it's elegant without being flashy, perfect for those who love understated beauty."
    images={['images/products/leaf-crystal-1.webp','images/products/leaf-crystal-2.webp','images/products/leaf-crystal-3.jpeg','images/products/leaf-crystal-4.jpeg','images/products/leaf-crystal-5.jpeg']}
    videoSrc={null}
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Motif', value:'Leaf / Botanical'},
      {label:'Stones', value:'Cubic Zirconia'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Size', value:'Adjustable'},
      {label:'Band Type', value:'Open adjustable band'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Orbit Crystal Ring', price:'₹499', img:'images/products/orbit-crystal-1.jpeg'},
      {name:'Slim Crystal Band', price:'₹399', img:'images/products/slim-crystal-1.webp'},
      {name:'Solitaire Spark Ring', price:'₹349', img:'images/products/solitaire-spark-1.webp'},
      {name:'Rose Gold Square Earring', price:'₹289', img:'images/products/rose-gold-earring-1.jpeg'},
    ]}
  />;
}
