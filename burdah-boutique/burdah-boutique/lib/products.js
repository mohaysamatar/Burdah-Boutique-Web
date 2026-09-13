import { connectDB } from './mongodb'
import Product from '@/models/Product'

// Shapes a raw Mongoose product into exactly what ProductCard expects.
export function toCardProduct(product) {
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
  return {
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images?.[0] || null,
    inStock: totalStock > 0,
  }
}

// Used on the homepage — all active products, grouped by category.
export async function getActiveProductsByCategory() {
  await connectDB()
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean()

  const byCategory = {}
  for (const product of products) {
    const list = byCategory[product.category] || (byCategory[product.category] = [])
    list.push(toCardProduct(product))
  }
  return byCategory
}

// Used on the "View all" category page — just the one category.
export async function getActiveProductsForCategory(category) {
  await connectDB()
  const products = await Product.find({ isActive: true, category })
    .sort({ createdAt: -1 })
    .lean()
  return products.map(toCardProduct)
}

// Used on the product detail page — full product, not the trimmed card shape.
export async function getProductBySlug(slug) {
  await connectDB()
  const product = await Product.findOne({ slug }).lean()
  // Serialize fully (ObjectIds, Dates) so it's safe to pass into a client component.
  return product ? JSON.parse(JSON.stringify(product)) : null
}
