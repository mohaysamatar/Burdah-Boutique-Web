'use client'

import { useState } from 'react'
import { formatKES } from '@/lib/format'

export default function ProductDetail({ product }) {
  const { name, description, price, images, variants } = product

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(
    variants.findIndex((v) => v.stock > 0) !== -1
      ? variants.findIndex((v) => v.stock > 0)
      : 0
  )

  const selectedVariant = variants[selectedVariantIndex]
  const hasAnyStock = variants.some((v) => v.stock > 0)

  function variantLabel(variant) {
    return variant.color ? `${variant.size} — ${variant.color}` : variant.size
  }

  function stockMessage(variant) {
    if (variant.stock === 0) return { text: 'Sold out', tone: 'text-danger' }
    if (variant.stock <= variant.lowStockThreshold) {
      return { text: `Only ${variant.stock} left`, tone: 'text-goldDark' }
    }
    return { text: 'In stock', tone: 'text-success' }
  }

  const currentStock = stockMessage(selectedVariant)

  return (
    <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="flex aspect-[3/4] items-center justify-center border border-navy/10 bg-stone">
          {images?.[selectedImage] ? (
            <img
              src={images[selectedImage]}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-6xl italic text-navy/20">B</span>
          )}
        </div>

        {images?.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.map((img, index) => (
              <button
                key={img}
                onClick={() => setSelectedImage(index)}
                className={`h-16 w-16 border ${
                  index === selectedImage ? 'border-gold' : 'border-navy/10'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <h1 className="font-display text-3xl italic text-navy">{name}</h1>
        <p className="mt-2 text-xl text-goldDark">{formatKES(price)}</p>

        {description && (
          <p className="mt-4 text-sm leading-relaxed text-navyText/70">{description}</p>
        )}

        {hasAnyStock ? (
          <>
            <div className="mt-6">
              <p className="text-sm text-navyText">Size / Volume{variants.some(v => v.color) ? ' & Color' : ''}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {variants.map((variant, index) => {
                  const isSelected = index === selectedVariantIndex
                  const isOutOfStock = variant.stock === 0
                  return (
                    <button
                      key={variant.sku}
                      onClick={() => setSelectedVariantIndex(index)}
                      disabled={isOutOfStock}
                      className={`border px-4 py-2 text-sm transition-colors ${
                        isSelected
                          ? 'border-navy bg-navy text-ivory'
                          : isOutOfStock
                          ? 'border-navy/10 text-navyText/30 line-through cursor-not-allowed'
                          : 'border-navy/20 text-navyText hover:border-gold hover:text-gold'
                      }`}
                    >
                      {variantLabel(variant)}
                    </button>
                  )
                })}
              </div>
            </div>

            <p className={`mt-3 text-xs ${currentStock.tone}`}>{currentStock.text}</p>

            <button
              disabled
              title="Cart coming soon"
              className="mt-6 w-full border border-navy/20 bg-navy/5 py-3 text-sm text-navyText/40 cursor-not-allowed"
            >
              Add to bag — coming soon
            </button>
          </>
        ) : (
          <p className="mt-8 border border-dashed border-navy/15 px-6 py-6 text-center text-sm text-navyText/50">
            This item is currently sold out in every size.
          </p>
        )}
      </div>
    </div>
  )
}
