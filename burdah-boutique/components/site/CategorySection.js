import ProductCard from './ProductCard'

export default function CategorySection({ id, title, blurb, products, viewAllHref }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-6 py-14 border-t border-navy/10">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl italic text-navy">{title}</h2>
          {blurb && (
            <p className="mt-1 max-w-md text-sm text-navyText/70">{blurb}</p>
          )}
        </div>
        <a
          href={viewAllHref || '#'}
          className="whitespace-nowrap text-sm text-navyText/70 hover:text-gold transition-colors"
        >
          View all
        </a>
      </div>

      {products.length === 0 ? (
        <p className="border border-dashed border-navy/15 px-6 py-10 text-center text-sm text-navyText/50">
          New arrivals coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
