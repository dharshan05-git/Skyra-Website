const PRODUCT_SLUG_MAP = {
  'rosé amour pendant':        'rose-amour',
  'rose amour pendant':        'rose-amour',
  'aqua heart pendant':        'aqua-heart',
  'the aqua heart pendant':    'aqua-heart',
  'ocean solitaire pendant':   'ocean-solitaire',
  'lumé tennis bracelet':      'lume-bracelet',
  'lume tennis bracelet':      'lume-bracelet',
  'eterna pearl stud earrings':'eterna-pearl',
  'eterna pearl studs':        'eterna-pearl',
  'slim crystal band':         'slim-crystal',
  'solitaire spark ring':      'solitaire-spark',
  'orbit crystal ring':        'orbit-crystal',
  'leaf crystal ring':         'leaf-crystal',
  'noor solitaire set':        'noor-set',
  'zivara bow set':            'zivara-bow',
  'soleil bloom set':          'soleil-bloom',
  'elvara pear halo set':      'elvara-pear',
  'rose gold square earring':  'rose-gold-square',
  'azura square drop earrings':'azura-square',
  'azura square drop':         'azura-square',
  'classic silver payal':      'classic-payal',
  'traditional ghunghroo payal':'ghunghroo-payal',
  'hamsa pendant necklace':    'hamsa-pendant',
  'lehar bangle set':          'lehar-bangle',
  'triple stone elegance ring':'triple-stone',
};

export function getProductUrl(name) {
  if (!name) return '#';
  const key = name.toLowerCase().trim();
  const slug = PRODUCT_SLUG_MAP[key];
  return slug ? `/product-${slug}` : '#';
}
