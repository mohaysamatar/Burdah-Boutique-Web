import { notFound } from 'next/navigation'
import Navbar from '@/components/site/Navbar'
import Footer from '@/components/site/Footer'
import ProductDetail from '@/components/site/ProductDetail'
import { getCategoryMeta } from '@/lib/categories'
import { getProductBySlug } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || !product.isActive) notFound()

  const categoryMeta = getCategoryMeta(product.category)

  return (
    <main>
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav className="text-xs text-navyText/50">
          <a href="/" className="hover:text-gold transition-colors">Home</a>
          {categoryMeta && (
            <>
              {' / '}
              <a href={`/shop/${product.category}`} className="hover:text-gold transition-colors">
                {categoryMeta.title}
              </a>
            </>
          )}
          {' / '}
          <span className="text-navyText/70">{product.name}</span>
        </nav>

        <ProductDetail product={product} />
      </div>

      <Footer />
    </main>
  )
}