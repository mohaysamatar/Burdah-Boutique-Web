export default function Footer() {
  return (
    <footer className="mt-24 border-t border-navy/10 bg-navy">
      <div className="mx-auto max-w-6xl px-6 py-12 text-ivory">
        <p className="font-display text-lg italic text-gold">Burdah Boutique</p>
        <p className="mt-3 max-w-sm text-sm text-ivory/70">
          Authentic modest wear &mdash; abayas, hijabs, shoes, perfumes, and
          bags, chosen for how they're actually worn.
        </p>
        <div className="mt-8 flex gap-8 text-sm text-ivory/70">
          <a href="#" className="hover:text-gold transition-colors">Shop</a>
          <a href="#" className="hover:text-gold transition-colors">Returns</a>
          <a href="#" className="hover:text-gold transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}
