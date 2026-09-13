import Navbar from '@/components/site/Navbar'
import Hero from '@/components/site/Hero'
import CategorySection from '@/components/site/CategorySection'
import Footer from '@/components/site/Footer'
import { CATEGORIES } from '@/lib/categories'
import { getActiveProductsByCategory } from '@/lib/products'

// Always fetch fresh from the DB — products change via the admin panel,
// so this page shouldn't be statically cached at build time.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const byCategory = await getActiveProductsByCategory()

  return (
    <main>
      <Navbar />
      <Hero />

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
