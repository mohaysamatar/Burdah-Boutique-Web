require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

const TEST_EMAIL = 'test-data@burdah-boutique.dev'

async function main() {
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI is missing — check your .env.local file.')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)

  const VariantSchema = new mongoose.Schema({
    size: String,
    color: String,
    sku: String,
    stock: Number,
    lowStockThreshold: Number,
  })

  const ProductSchema = new mongoose.Schema({
    name: String,
    slug: String,
    category: String,
    price: Number,
    variants: [VariantSchema],
  })

  const OrderItemSchema = new mongoose.Schema({
    product: mongoose.Schema.Types.ObjectId,
    sku: String,
    name: String,
    category: String,
    size: String,
    color: String,
    price: Number,
    quantity: Number,
  })

  const OrderSchema = new mongoose.Schema(
    {
      customerEmail: String,
      items: [OrderItemSchema],
      subtotal: Number,
      total: Number,
      status: String,
    },
    { timestamps: true }
  )

  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
  const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

  // Clear any test orders from a previous run so this script is safe to re-run.
  const deleted = await Order.deleteMany({ customerEmail: TEST_EMAIL })
  if (deleted.deletedCount > 0) {
    console.log(`Cleared ${deleted.deletedCount} old test orders.`)
  }

  // Use your real products if you have any yet. Otherwise, create a few
  // throwaway sample products (prefixed TEST-) just so this script has
  // something to attach orders to.
  let products = await Product.find({})
  let createdSampleProducts = false

  if (products.length === 0) {
    console.log('No products found — creating sample products for test orders...')
    createdSampleProducts = true
    products = await Product.insertMany([
      {
        name: 'Black Crepe Abaya', slug: 'test-black-crepe-abaya', category: 'abayas', price: 9500,
        variants: [{ size: 'M', color: 'Black', sku: 'TEST-ABY-BLK-M', stock: 20, lowStockThreshold: 5 }],
      },
      {
        name: 'Chiffon Hijab, Ivory', slug: 'test-chiffon-hijab-ivory', category: 'scarves', price: 1800,
        variants: [{ size: 'OS', color: 'Ivory', sku: 'TEST-SCF-IVY-OS', stock: 40, lowStockThreshold: 8 }],
      },
      {
        name: 'Pointed Flat, Black', slug: 'test-pointed-flat-black', category: 'shoes', price: 4200,
        variants: [{ size: '38', color: 'Black', sku: 'TEST-SHO-BLK-38', stock: 15, lowStockThreshold: 4 }],
      },
      {
        name: 'Oud Rose Attar', slug: 'test-oud-rose-attar', category: 'perfumes', price: 3200,
        variants: [{ size: '12ml', color: 'N/A', sku: 'TEST-PRF-OUD-12', stock: 25, lowStockThreshold: 6 }],
      },
      {
        name: 'Structured Tote, Navy', slug: 'test-structured-tote-navy', category: 'bags', price: 6200,
        variants: [{ size: 'OS', color: 'Navy', sku: 'TEST-BAG-NVY-OS', stock: 10, lowStockThreshold: 3 }],
      },
    ])
  }

  const statuses = ['paid', 'shipped', 'delivered']
  const now = new Date()
  const orders = []

  // Spread ~24 fake orders across the last 5 months, across whatever products are available.
  for (let i = 0; i < 24; i++) {
    const product = products[Math.floor(Math.random() * products.length)]
    const variant = product.variants?.[0] || { size: 'OS', color: 'N/A', sku: product.slug }
    const quantity = Math.ceil(Math.random() * 3)
    const monthsAgo = Math.floor(Math.random() * 5)
    const createdAt = new Date(now.getFullYear(), now.getMonth() - monthsAgo, Math.ceil(Math.random() * 27))
    const total = product.price * quantity

    orders.push({
      customerEmail: TEST_EMAIL,
      items: [{
        product: product._id,
        sku: variant.sku,
        name: product.name,
        category: product.category,
        size: variant.size,
        color: variant.color,
        price: product.price,
        quantity,
      }],
      subtotal: total,
      total,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt,
      updatedAt: createdAt,
    })
  }

  await Order.insertMany(orders, { timestamps: false })

  console.log(`Created ${orders.length} test orders across ${products.length} product(s).`)
  if (createdSampleProducts) {
    console.log('Note: 5 sample products (prefixed "test-") were created since none existed yet.')
  }
  console.log('Visit /admin/analytics to see the charts populated.')
  console.log(`Re-run this script anytime — it clears old test orders (${TEST_EMAIL}) before adding new ones.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
