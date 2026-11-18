import raw from '@/data/products.json'

export type Product = {
  id: string
  name: string
  subTitle: string
  category: string
  gender: string
  price: number
  currency: string
  color: string
  rating: number
  reviewCount: number
  description: string
  tags: string[]
  sizes: string[]
  image: string
  gallery: string[]
  url: string
  inStock: boolean
}

export const products = raw as Product[]

export const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]
export const genders = ['All', 'Men', 'Women', 'Unisex', 'Kids']

export const formatPrice = (p: Product) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: p.currency || 'USD' }).format(p.price)

/** Strip the run-on "Benefits/Product Details" sections from the scraped description. */
export const shortDescription = (p: Product) => p.description.split(/Benefits|Product Details/)[0].trim()

const STOP = new Set(['i', 'a', 'an', 'the', 'for', 'me', 'some', 'want', 'need', 'show', 'find', 'something', 'with', 'and', 'to', 'of', 'in', 'my', 'looking', 'good', 'best', 'any', 'please', 'get', 'give', 'recommend', 'is', 'are', 'what'])

/** Lightweight local recommender used by the Wrecz assistant. */
export function recommend(query: string, limit = 4): { items: Product[]; note: string } {
  const q = query.toLowerCase()
  const priceMatch = q.match(/(?:under|below|less than|<|max|cheaper than)\s*\$?(\d+)/)
  const maxPrice = priceMatch ? Number(priceMatch[1]) : undefined
  const gender = /\b(women|womens|woman|her|ladies)\b/.test(q)
    ? 'Women'
    : /\b(kids|kid|boys|girls|child|children)\b/.test(q)
      ? 'Kids'
      : /\b(men|mens|man|him|guys)\b/.test(q)
        ? 'Men'
        : undefined

  const terms = q
    .replace(/\$?\d+/g, ' ')
    .split(/[^a-z-]+/)
    .filter((t) => t.length > 2 && !STOP.has(t))
    .map((t) => t.replace(/s$/, ''))

  const scored = products
    .filter((p) => p.inStock)
    .filter((p) => (maxPrice ? p.price <= maxPrice : true))
    .filter((p) => (gender ? p.gender === gender || p.gender === 'Unisex' : true))
    .map((p) => {
      const hay = [p.name, p.subTitle, p.category, p.color, ...p.tags].join(' ').toLowerCase()
      let score = 0
      for (const t of terms) if (hay.includes(t)) score += p.tags.some((tag) => tag.includes(t)) ? 3 : 2
      return { p, score: score + p.rating / 10 }
    })
    .filter((s) => (terms.length ? s.score >= 1 : true))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.p)

  const bits = [gender && gender.toLowerCase(), maxPrice && `under $${maxPrice}`].filter(Boolean).join(', ')
  const note = scored.length
    ? `Here ${scored.length === 1 ? 'is a pick' : `are ${scored.length} picks`}${bits ? ` (${bits})` : ''}. Tap one to see details.`
    : `Nothing matched that exactly. Try a category like "running shoes", "hoodie under $80" or "women's sports bra".`
  return { items: scored, note }
}
