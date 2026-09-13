require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
 
const TEST_EMAIL = 'test-data@burdah-boutique.dev'
 
async function main() {
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI is missing — check your .env.local file.')
    process.exit(1)
  }
 
  await mongoose.connect(process.env.MONGODB_URI)
 
  // Loose schemas — we're only deleting here, not validating shape.
  const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }))
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }))
 
  const deletedOrders = await Order.deleteMany({ customerEmail: TEST_EMAIL })
  console.log(`Removed ${deletedOrders.deletedCount} test order(s).`)
 
  // The seed script only creates products prefixed "test-" as a slug, and
  // only when no real products existed yet — safe to remove by that prefix.
  const deletedProducts = await Product.deleteMany({ slug: { $regex: /^test-/ } })
  if (deletedProducts.deletedCount > 0) {
    console.log(`Removed ${deletedProducts.deletedCount} sample test product(s) (slug starting with "test-").`)
  } else {
    console.log('No sample test products found (you were likely already using real products).')
  }
 
  console.log('Test data cleared.')
  process.exit(0)
}
 
main().catch((err) => {
  console.error(err)
  process.exit(1)
})