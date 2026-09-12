export const CATEGORIES = [
  {
    key: 'abayas',
    title: 'Abayas',
    blurb: 'Everyday and occasion abayas, cut for full coverage without losing shape.',
  },
  {
    key: 'scarves',
    title: 'Scarves',
    blurb: 'Hijabs and shawls in chiffon, jersey, and modal — breathable, easy to style.',
  },
  {
    key: 'shoes',
    title: 'Shoes',
    blurb: 'Flats, sandals, and loafers built for modest, all-day wear.',
  },
  {
    key: 'perfumes',
    title: 'Perfumes',
    blurb: 'Alcohol-free attars and oils — long-lasting and prayer-friendly.',
  },
  {
    key: 'bags',
    title: 'Bags',
    blurb: 'Totes, clutches, and crossbody bags to finish the look.',
  },
]

export function getCategoryMeta(key) {
  return CATEGORIES.find((c) => c.key === key)
}
