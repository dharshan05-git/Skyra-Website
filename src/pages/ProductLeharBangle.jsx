import ProductPage from './ProductPage';

export default function ProductLeharBangle() {
  return <ProductPage
    name="Lehar Bangle Set"
    price="₹599"
    reviews="61"
    description="The Lehar Bangle Set captures the flowing movement of ocean waves in a set of beautifully designed bangles. Each bangle features intricate patterns and crystal accents that catch the light with every movement. Wear them together as a stack or separately for a versatile look."
    images={['images/products/lehar-bangle-4.jpeg','images/products/lehar-bangle-2.webp','images/products/lehar-bangle-3.webp','images/products/lehar-bangle-1.webp']}
    videoSrc="images/products/lehar-bangle-video.mp4"
    specs={[
      {label:'Material', value:'Alloy (Silver-Plated)'},
      {label:'Style', value:'Bangle Set'},
      {label:'Stones', value:'Crystal Accents'},
      {label:'Finish', value:'Silver-tone'},
      {label:'Size', value:'Standard (fits most)'},
      {label:'Pieces', value:'Set of 3'},
      {label:'Weight', value:'Lightweight'},
    ]}
    recommendations={[
      {name:'Lumé Tennis Bracelet', price:'₹399', img:'images/products/lume-bracelet-1.webp'},
      {name:'Classic Silver Payal', price:'₹299', img:'images/products/classic-payal-1.jpeg'},
      {name:'Ghunghroo Payal', price:'₹399', img:'images/products/ghunghroo-1.jpeg'},
      {name:'Aqua Heart Pendant', price:'₹599', img:'images/products/aqua-heart-1.webp'},
    ]}
  />;
}
