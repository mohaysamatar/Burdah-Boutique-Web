import Navbar from '@/components/site/Navbar'
import Hero from '@/components/site/Hero'
import CategorySection from '@/components/site/CategorySection'
import Footer from '@/components/site/Footer'

// Mock data — replace with real fetches to /api/products?category=... once the DB is wired up.
const abayas = [
  { slug: 'black-crepe-abaya', name: 'Black crepe abaya', price: 9500, inStock: true },
  { slug: 'emerald-silk-abaya', name: 'Emerald silk abaya', price: 12500, inStock: true },
  { slug: 'open-front-abaya-sand', name: 'Open-front abaya, sand', price: 8900, inStock: true },
  { slug: 'embroidered-abaya-navy', name: 'Embroidered abaya, navy', price: 13800, inStock: false },
]

const scarves = [
  { slug: 'chiffon-hijab-ivory', name: 'Chiffon hijab, ivory', price: 1800, inStock: true },
  { slug: 'jersey-hijab-gold-trim', name: 'Jersey hijab, gold trim', price: 2100, inStock: true },
  { slug: 'modal-hijab-navy', name: 'Modal hijab, navy', price: 1900, inStock: true },
  { slug: 'printed-shawl-earth-tones', name: 'Printed shawl, earth tones', price: 2400, inStock: true },
]

const shoes = [
  { slug: 'pointed-flat-black', name: 'Pointed flat, black', price: 4200, inStock: true },
  { slug: 'embellished-sandal-gold', name: 'Embellished sandal, gold', price: 5100, inStock: true },
  { slug: 'suede-loafer-navy', name: 'Suede loafer, navy', price: 4800, inStock: false },
  { slug: 'block-heel-mule-sand', name: 'Block heel mule, sand', price: 5400, inStock: true },
]

const perfumes = [
  { slug: 'oud-rose-attar', name: 'Oud rose attar', price: 3200, inStock: true },
  { slug: 'amber-musk-oil', name: 'Amber musk perfume oil', price: 2900, inStock: true },
  { slug: 'white-jasmine-attar', name: 'White jasmine attar', price: 3100, inStock: true },
  { slug: 'sandalwood-oud-oil', name: 'Sandalwood oud oil', price: 3600, inStock: true },
]

const bags = [
  { slug: 'structured-tote-navy', name: 'Structured tote, navy', price: 6200, inStock: true },
  { slug: 'embroidered-clutch-gold', name: 'Embroidered clutch, gold', price: 3800, inStock: true },
  { slug: 'crossbody-bag-black', name: 'Crossbody bag, black', price: 4500, inStock: true },
  { slug: 'woven-basket-bag-sand', name: 'Woven basket bag, sand', price: 3900, inStock: false },
]

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />

      <CategorySection
        id="abayas"
        title="Abayas"
        blurb="Everyday and occasion abayas, cut for full coverage without losing shape."
        products={abayas}
      />
      <CategorySection
        id="scarves"
        title="Scarves"
        blurb="Hijabs and shawls in chiffon, jersey, and modal — breathable, easy to style."
        products={scarves}
      />
      <CategorySection
        id="shoes"
        title="Shoes"
        blurb="Flats, sandals, and loafers built for modest, all-day wear."
        products={shoes}
      />
      <CategorySection
        id="perfumes"
        title="Perfumes"
        blurb="Alcohol-free attars and oils — long-lasting and prayer-friendly."
        products={perfumes}
      />
      <CategorySection
        id="bags"
        title="Bags"
        blurb="Totes, clutches, and crossbody bags to finish the look."
        products={bags}
      />

      <Footer />
    </main>
  )
}
