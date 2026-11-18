import { useCallback, useMemo, useState } from 'react'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import ProductModal from '@/components/ProductModal'
import Wrecz from '@/components/Wrecz'
import { categories, genders, products, type Product } from '@/lib/products'

const PAGE = 12

export default function App() {
  const [category, setCategory] = useState('All')
  const [gender, setGender] = useState('All')
  const [visible, setVisible] = useState(PAGE)
  const [active, setActive] = useState<Product | null>(null)
  const [aiFilterIds, setAiFilterIds] = useState<string[] | null>(null)
  const [aiFilterLabel, setAiFilterLabel] = useState<string>('')

  const close = useCallback(() => setActive(null), [])

  const handleApplyAiFilter = useCallback((productIds: string[], label: string) => {
    setAiFilterIds(productIds)
    setAiFilterLabel(label)
    setVisible(PAGE)
    const el = document.getElementById('products')
    el?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const clearAiFilter = useCallback(() => {
    setAiFilterIds(null)
    setAiFilterLabel('')
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (aiFilterIds && aiFilterIds.length > 0 && !aiFilterIds.includes(p.id)) {
        return false
      }
      const matchesCategory = category === 'All' || p.category === category
      const matchesGender = gender === 'All' || p.gender === gender
      return matchesCategory && matchesGender
    })
  }, [category, gender, aiFilterIds])

  const pick = (setter: (v: string) => void) => (v: string) => {
    setter(v)
    setVisible(PAGE)
  }

  return (
    <div className="min-h-dvh pb-36">
      <Header />

      <main className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Hero */}
        <section className="mt-20 grid gap-8 border-b border-black pb-12 md:mt-28 md:grid-cols-[1fr_auto] md:items-end">
          <h1 className="text-[clamp(44px,8vw,112px)] font-medium uppercase leading-[0.88] tracking-[-0.04em]">
            Built to move.
            <br />
            <span className="text-black/25">Picked by Us.</span>
          </h1>
          <div className="flex gap-10 font-mono text-[12px] uppercase md:flex-col md:gap-3 md:text-right">
            <p>
              <span className="block text-3xl md:text-4xl">{products.length}</span>items in stock
            </p>
            <p>
              <span className="block text-3xl md:text-4xl">{categories.length - 1}</span>categories
            </p>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="scroll-mt-6 pt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => pick(setCategory)(c)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-[14px] transition-colors ${category === c ? 'border-black bg-black text-white' : 'border-black/20 hover:border-black'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex shrink-0 self-start border border-black font-mono text-[12px] uppercase lg:self-auto">
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => pick(setGender)(g)}
                  className={`px-3 py-2 transition-colors [&:not(:first-child)]:border-l [&:not(:first-child)]:border-black ${gender === g ? 'bg-black text-white' : 'hover:bg-paper'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* AI Filter Notice */}
          {aiFilterIds && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-black bg-black p-4 text-white">
              <div className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-white/60">Gemini AI Recommendations Active</p>
                  <p className="text-[13px] font-medium text-white/95 line-clamp-1">Showing {filtered.length} picks matching your request</p>
                </div>
              </div>
              <button
                onClick={clearAiFilter}
                className="border border-white/30 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
              >
                Clear AI Filter &times;
              </button>
            </div>
          )}

          <p className="mt-8 font-mono text-[12px] uppercase text-black/50">
            Showing {Math.min(visible, filtered.length)} of {filtered.length}
          </p>

          {filtered.length ? (
            <div className="mt-3 grid grid-cols-2 gap-px border border-black bg-black md:grid-cols-3 lg:grid-cols-4">
              {filtered.slice(0, visible).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onOpen={setActive} />
              ))}
            </div>
          ) : (
            <p className="mt-3 border border-black p-12 text-center text-black/60">No products match these filters.</p>
          )}

          {visible < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button onClick={() => setVisible((v) => v + PAGE)} className="border border-black px-8 py-3 font-mono text-[12px] uppercase transition-colors hover:bg-black hover:text-white">
                Load more
              </button>
            </div>
          )}
        </section>

        {/* About + Help */}
        <section className="mt-28 grid border border-black md:grid-cols-2">
          <div id="about" className="scroll-mt-6 p-8 md:border-r md:border-black md:p-12">
            <p className="font-mono text-[12px] uppercase text-black/50">01 / About</p>
            <h2 className="mt-6 text-3xl font-medium leading-tight tracking-[-0.02em]">Authorized, premium, and nothing in between.</h2>
            <p className="mt-4 max-w-md text-black/65">
              Wrecz is an authorized reseller of genuine Nike performance gear. Every item is sourced direct, and our AI stylist helps you find the right fit in seconds.
            </p>
          </div>
          <div id="help" className="scroll-mt-6 border-t border-black p-8 md:border-t-0 md:p-12">
            <p className="font-mono text-[12px] uppercase text-black/50">02 / Help center</p>
            <ul className="mt-6 divide-y divide-black/15">
              {[
                ['Shipping', 'Free on orders over $75. 2-5 business days.'],
                ['Returns', '30 days, unworn, tags attached.'],
                ['Sizing', 'Not sure? Ask Wrecz for a fit recommendation.'],
              ].map(([t, d]) => (
                <li key={t} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between sm:gap-6">
                  <span className="font-medium">{t}</span>
                  <span className="text-black/60 sm:text-right">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="mt-12 flex flex-col justify-between gap-2 font-mono text-[11px] uppercase text-black/50 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Wrecz</span>
          <span>Authorized premium reseller</span>
        </footer>
      </main>

      <Wrecz onOpenProduct={setActive} onFilterCatalog={handleApplyAiFilter} />
      <ProductModal product={active} onClose={close} />
    </div>
  )
}
