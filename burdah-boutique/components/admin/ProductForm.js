'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const emptyVariant = { size: '', color: '', sku: '', stock: 0, lowStockThreshold: 5 }

export default function ProductForm({ initialProduct }) {
  const router = useRouter()
  const isEditing = Boolean(initialProduct)

  const [name, setName] = useState(initialProduct?.name || '')
  const [slug, setSlug] = useState(initialProduct?.slug || '')
  const [category, setCategory] = useState(initialProduct?.category || 'abayas')
  const [price, setPrice] = useState(initialProduct?.price || '')
  const [description, setDescription] = useState(initialProduct?.description || '')
  const [variants, setVariants] = useState(
    initialProduct?.variants?.length ? initialProduct.variants : [{ ...emptyVariant }]
  )
  const [images, setImages] = useState(initialProduct?.images || [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function updateVariant(index, field, value) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }

  function addVariant() {
    setVariants((prev) => [...prev, { ...emptyVariant }])
  }

  function removeVariant(index) {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || 'Image upload failed.')
        return
      }

      setImages((prev) => [...prev, data.url])
    } catch (err) {
      setError(`Image upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      name,
      slug: slug || slugify(name),
      category,
      price: Number(price),
      description,
      images,
      variants: variants.map((v) => ({
        ...v,
        stock: Number(v.stock),
        lowStockThreshold: Number(v.lowStockThreshold) || 5,
      })),
    }

    const url = isEditing ? `/api/products/${initialProduct._id}` : '/api/products'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Something went wrong saving this product (${res.status}).`)
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      // Network failure, server not reachable, etc. — surface it instead of
      // silently leaving the button stuck on "Saving…".
      setError(`Could not reach the server: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-navyText">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-navy/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-navyText">Slug (optional)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated from name"
            className="mt-1 w-full border border-navy/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-navyText">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full border border-navy/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          >
            <option value="abayas">Abayas</option>
            <option value="scarves">Scarves</option>
            <option value="shoes">Shoes</option>
            <option value="perfumes">Perfumes</option>
            <option value="bags">Bags</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-navyText">Price (KSh)</label>
          <input
            required
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full border border-navy/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-navyText">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full border border-navy/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="text-sm text-navyText">Photos</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={url} className="relative h-24 w-24 border border-navy/10">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-danger text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}

          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center border border-dashed border-navy/25 text-center text-xs text-navyText/60 hover:border-gold hover:text-gold transition-colors">
            {uploading ? 'Uploading…' : '+ Add photo'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm text-navyText">Variants (size/volume, color, stock)</label>
          <button
            type="button"
            onClick={addVariant}
            className="text-sm text-gold hover:underline"
          >
            + Add variant
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-end">
              <div>
                <label className="text-xs text-navyText/60">Size / Volume</label>
                <input
                  required
                  value={variant.size}
                  placeholder="e.g. M or 12ml"
                  onChange={(e) => updateVariant(index, 'size', e.target.value)}
                  className="mt-1 w-full border border-navy/20 bg-white px-2 py-1.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-navyText/60">Color (optional)</label>
                <input
                  value={variant.color}
                  placeholder="leave blank if N/A"
                  onChange={(e) => updateVariant(index, 'color', e.target.value)}
                  className="mt-1 w-full border border-navy/20 bg-white px-2 py-1.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-navyText/60">SKU</label>
                <input
                  required
                  value={variant.sku}
                  onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                  className="mt-1 w-full border border-navy/20 bg-white px-2 py-1.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-navyText/60">Stock</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                  className="mt-1 w-full border border-navy/20 bg-white px-2 py-1.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                disabled={variants.length === 1}
                className="mb-1.5 text-xs text-danger hover:underline disabled:opacity-30"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-navy px-6 py-2.5 text-sm text-ivory hover:bg-navy/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create product'}
        </button>
        <a
          href="/admin/products"
          className="border border-navy/20 px-6 py-2.5 text-sm text-navyText hover:border-navy/40 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
