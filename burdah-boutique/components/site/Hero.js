export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
      <div>
        <h1 className="font-display text-5xl italic leading-tight text-navy md:text-6xl">
          Modesty, made elegant.
        </h1>
        <p className="mt-6 max-w-md text-navyText/80">
          Burdah Boutique curates authentic modest wear for the everyday and
          the occasion &mdash; abayas cut for how they drape, hijabs in
          fabrics that hold their shape, and the shoes, bags, and scent to
          finish it properly.
        </p>
        <a
          href="/shop"
          className="mt-8 inline-block border border-navy px-8 py-3 text-sm text-navy transition-colors hover:bg-navy hover:text-ivory"
        >
          Explore the collection
        </a>
      </div>

      <div className="relative flex aspect-[4/5] items-center justify-center border border-navy/15 bg-stone">
        <span className="font-display text-[10rem] italic leading-none text-gold/40">
          B
        </span>
      </div>
    </section>
  )
}
