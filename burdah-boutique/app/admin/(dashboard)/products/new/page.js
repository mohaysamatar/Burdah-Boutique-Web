import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl italic text-navy">Add product</h1>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  )
}
