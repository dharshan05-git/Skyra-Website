import ProductPage from './ProductPage';

export default function ProductAzuraSquare() {
  return <ProductPage
    name="Azura Square Drop Earrings"
    price="₹249"
    reviews="89"
    description="Bold geometry meets feminine elegance in the Azura Square Drop Earrings. The clean square drop design is framed with a sparkling border of zircon stones, creating a modern look that transitions seamlessly from day to evening. Light enough to wear all day, striking enough to turn heads."
    images={['images/products/azura-square-1.webp','images/products/azura-square-2.webp','images/products/azura-square-3.jpeg','images/products/azura-square-4.webp']}
    videoSrc={null}
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Style', value:'Square Drop Earrings'},
      {label:'Stones', value:'Cubic Zirconia (Border)'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Closure', value:'Push Back / Butterfly'},
      {label:'Size', value:'Medium Drop'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Eterna Pearl Stud Earrings', price:'₹349', img:'images/products/eterna-pearl-1.webp'},
      {name:'Rose Gold Square Earring', price:'₹289', img:'images/products/rose-gold-earring-1.jpeg'},
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
      {name:'Soleil Bloom Set', price:'₹699', img:'images/products/soleil-bloom-1.webp'},
    ]}
  />;
}
