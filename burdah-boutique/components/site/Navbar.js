export default function Navbar() {
  const links = [
    { label: 'Abayas', href: '#abayas' },
    { label: 'Scarves', href: '#scarves' },
    { label: 'Shoes', href: '#shoes' },
    { label: 'Perfumes', href: '#perfumes' },
    { label: 'Bags', href: '#bags' },
  ]

  return (
    <header className="border-b border-navy/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="/" className="font-display text-xl italic text-navy">
          Burdah Boutique
        </a>

        <nav className="hidden gap-8 text-sm text-navyText md:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-gold transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-navy">
          <a href="/account" className="text-sm hover:text-gold transition-colors">
            Account
          </a>
          <a href="/cart" className="text-sm hover:text-gold transition-colors">
            Cart (0)
          </a>
        </div>
      </div>
    </header>
  )
}
