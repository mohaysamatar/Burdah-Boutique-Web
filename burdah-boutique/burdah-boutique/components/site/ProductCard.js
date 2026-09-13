import { formatKES } from '@/lib/format'

export default function ProductCard({ product }) {
  const { name, price, image, inStock } = product

  return (
    <a href={`/product/${product.slug}`} className="group block">
      <div className="relative flex aspect-[3/4] items-center justify-center border border-navy/10 bg-stone">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-4xl italic text-navy/20">B</span>
        )}
        {!inStock && (
          <span className="absolute bottom-3 left-3 bg-ivory px-2 py-1 text-xs text-danger">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between">
        <p className="text-sm text-navyText group-hover:text-gold transition-colors">
          {name}
        </p>
        <p className="text-sm text-goldDark">{formatKES(price)}</p>
      </div>
    </a>
  )
}
