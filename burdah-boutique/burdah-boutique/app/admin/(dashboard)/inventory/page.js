import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import StockBadge from '@/components/admin/StockBadge'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  await connectDB()
  const products = await Product.find({}).sort({ name: 1 })

  const rows = products.flatMap((product) =>
    product.variants.map((variant) => ({
      productId: product._id.toString(),
      productName: product.name,
      ...variant.toObject(),
    }))
  )

  // Low stock first, so what needs attention is at the top.
  rows.sort((a, b) => a.stock - b.stock)

  return (
    <div>
      <h1 className="font-display text-2xl italic text-navy">Inventory</h1>
      <p className="mt-1 text-sm text-navyText/60">{rows.length} variants across all products</p>

      <table className="mt-8 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-navy/10 text-navyText/50">
            <th className="py-3 font-normal">Product</th>
            <th className="py-3 font-normal">Size</th>
            <th className="py-3 font-normal">Color</th>
            <th className="py-3 font-normal">SKU</th>
            <th className="py-3 font-normal">Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.sku} className="border-b border-navy/5">
              <td className="py-3 text-navyText">
                <a href={`/admin/products/${row.productId}/edit`} className="hover:text-gold">
                  {row.productName}
                </a>
              </td>
              <td className="py-3 text-navyText/70">{row.size}</td>
              <td className="py-3 text-navyText/70">{row.color}</td>
              <td className="py-3 text-navyText/70">{row.sku}</td>
              <td className="py-3">
                <StockBadge stock={row.stock} threshold={row.lowStockThreshold} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <p className="mt-8 text-sm text-navyText/60">No variants yet — add a product first.</p>
      )}
    </div>
  )
}
