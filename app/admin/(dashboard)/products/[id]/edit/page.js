import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }) {
  await connectDB()
  const product = await Product.findById(params.id)

  if (!product) notFound()

  return (
    <div>
      <h1 className="font-display text-2xl italic text-navy">Edit product</h1>
      <div className="mt-8">
        <ProductForm initialProduct={JSON.parse(JSON.stringify(product))} />
      </div>
    </div>
  )
}
