import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import ProductTable from '@/components/admin/ProductTable'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  await connectDB()
  const products = await Product.find({}).sort({ createdAt: -1 })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl italic text-navy">Products</h1>
          <p className="mt-1 text-sm text-navyText/60">{products.length} total</p>
        </div>
        <a
          href="/admin/products/new"
          className="bg-navy px-5 py-2.5 text-sm text-ivory hover:bg-navy/90 transition-colors"
        >
          Add product
        </a>
      </div>

      <div className="mt-8">
        <ProductTable products={JSON.parse(JSON.stringify(products))} />
      </div>
    </div>
  )
}
