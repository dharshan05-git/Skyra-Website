import ProductPage from './ProductPage';

export default function ProductSolitaireSpark() {
  return <ProductPage
    name="Solitaire Spark Ring"
    price="₹349"
    reviews="108"
    description="A classic design with a modern touch, the Solitaire Spark Ring features a single round-cut zircon at the center, enhanced by subtle sparkle along the band. The raised setting reflects light beautifully, giving it a bright, eye-catching shine. Comfortable for everyday wear and special occasions alike."
    images={['images/products/solitaire-spark-1.webp','images/products/solitaire-spark-2.jpeg','images/products/solitaire-spark-3.jpeg','images/products/solitaire-spark-4.jpeg']}
    videoSrc="images/products/solitaire-spark-video.mp4"
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Center Stone', value:'Cubic Zirconia (Round Cut)'},
      {label:'Accent Stones', value:'Small zircon detailing on band'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Size', value:'Adjustable'},
      {label:'Band Type', value:'Open adjustable band'},
      {label:'Weight', value:'Lightweight'},
      {label:'Style', value:'Solitaire, Elegant'},
    ]}
    recommendations={[
      {name:'Slim Crystal Band', price:'₹399', img:'images/products/slim-crystal-1.webp'},
      {name:'Orbit Crystal Ring', price:'₹499', img:'images/products/orbit-crystal-1.jpeg'},
      {name:'Leaf Crystal Ring', price:'₹599', img:'images/products/leaf-crystal-1.webp'},
      {name:'Rose Gold Square Earring', price:'₹289', img:'images/products/rose-gold-earring-1.jpeg'},
    ]}
  />;
}
