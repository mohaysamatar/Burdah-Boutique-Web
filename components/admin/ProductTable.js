'use client'

import { useRouter } from 'next/navigation'
import StockBadge from './StockBadge'

export default function ProductTable({ products }) {
  const router = useRouter()

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return

    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('Failed to delete product.')
    }
  }

  if (products.length === 0) {
    return <p className="text-sm text-navyText/60">No products yet.</p>
  }

  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-navy/10 text-navyText/50">
          <th className="py-3 font-normal">Name</th>
          <th className="py-3 font-normal">Category</th>
          <th className="py-3 font-normal">Price</th>
          <th className="py-3 font-normal">Stock</th>
          <th className="py-3 font-normal">Status</th>
          <th className="py-3 font-normal"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
          return (
            <tr key={product._id} className="border-b border-navy/5">
              <td className="py-3 text-navyText">{product.name}</td>
              <td className="py-3 text-navyText/70 capitalize">{product.category}</td>
              <td className="py-3 text-navyText/70">KSh {product.price.toLocaleString()}</td>
              <td className="py-3">
                <StockBadge stock={totalStock} />
              </td>
              <td className="py-3 text-navyText/70">
                {product.isActive ? 'Active' : 'Hidden'}
              </td>
              <td className="py-3 text-right">
                <a
                  href={`/admin/products/${product._id}/edit`}
                  className="mr-4 text-navyText/70 hover:text-gold transition-colors"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(product._id, product.name)}
                  className="text-danger hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
