'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Inventory', href: '/admin/inventory' },
  { label: 'Analytics', href: '/admin/analytics' },
]

export default function Sidebar({ userName }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 flex-col justify-between border-r border-navy/10 bg-navy px-5 py-6 text-ivory">
      <div>
        <p className="font-display text-lg italic text-gold">Burdah</p>
        <p className="mb-8 text-xs text-ivory/50">Admin</p>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-ivory/10 text-gold' : 'text-ivory/80 hover:bg-ivory/5'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-ivory/10 pt-4">
        {userName && <p className="mb-2 text-xs text-ivory/50">Signed in as {userName}</p>}
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm text-ivory/70 hover:text-gold transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
