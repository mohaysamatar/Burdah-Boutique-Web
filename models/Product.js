import mongoose from 'mongoose'

const VariantSchema = new mongoose.Schema({
  size: { type: String, required: true },       // e.g. 'S', 'M', 'L', or a numeric size
  color: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 5 },
})

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, required: true },     // e.g. 'coats', 'dresses', 'accessories'
    images: [{ type: String }],                      // Cloudinary URLs
    variants: [VariantSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Virtual: total stock across all variants — handy for admin dashboard cards.
ProductSchema.virtual('totalStock').get(function () {
  return this.variants.reduce((sum, v) => sum + v.stock, 0)
})

ProductSchema.set('toJSON', { virtuals: true })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
