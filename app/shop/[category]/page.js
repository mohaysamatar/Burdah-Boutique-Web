import { notFound } from 'next/navigation'
import Navbar from '@/components/site/Navbar'
import Footer from '@/components/site/Footer'
import ProductCard from '@/components/site/ProductCard'
import { getCategoryMeta } from '@/lib/categories'
import { getActiveProductsForCategory } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }) {
  const { category } = await params
  const meta = getCategoryMeta(category)
  if (!meta) notFound()

  const products = await getActiveProductsForCategory(category)

  return (
    <main>
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="font-display text-3xl italic text-navy">{meta.title}</h1>
        <p className="mt-2 max-w-md text-sm text-navyText/70">{meta.blurb}</p>
        <p className="mt-1 text-xs text-navyText/40">{products.length} item(s)</p>

        {products.length === 0 ? (
          <p className="mt-10 border border-dashed border-navy/15 px-6 py-10 text-center text-sm text-navyText/50">
            New arrivals coming soon.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}