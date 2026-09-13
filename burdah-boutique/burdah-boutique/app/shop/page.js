import Navbar from '@/components/site/Navbar'
import Footer from '@/components/site/Footer'
import CategorySection from '@/components/site/CategorySection'
import { CATEGORIES } from '@/lib/categories'
import { getActiveProductsByCategory } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const byCategory = await getActiveProductsByCategory()

  return (
    <main>
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="font-display text-3xl italic text-navy">The Collection</h1>
        <p className="mt-2 max-w-md text-sm text-navyText/70">
          Everything Burdah Boutique carries, in one place.
        </p>
      </div>

      {CATEGORIES.map((category) => (
        <CategorySection
          key={category.key}
          id={category.key}
          title={category.title}
          blurb={category.blurb}
          products={byCategory[category.key] || []}
          viewAllHref={`/shop/${category.key}`}
        />
      ))}

      <Footer />
    </main>
  )
}
