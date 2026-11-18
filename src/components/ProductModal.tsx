import { useEffect, useState } from 'react'
import { formatPrice, shortDescription, type Product } from '@/lib/products'

export default function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [size, setSize] = useState<string | null>(null)

  useEffect(() => {
    setSize(null)
    if (!product) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        className="animate-rise grid max-h-[92dvh] w-full max-w-4xl overflow-y-auto border border-black bg-white sm:grid-cols-2"
      >
        <div className="relative bg-paper sm:border-r sm:border-black">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-contain p-10 mix-blend-multiply" />
          <span className="absolute left-4 top-4 font-mono text-[11px] uppercase text-black/50">{product.category}</span>
        </div>
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-black/50">
                {product.gender} / {product.color}
              </p>
              <h2 className="mt-2 text-2xl font-medium leading-tight">{product.name}</h2>
              <p className="mt-1 text-black/55">{product.subTitle}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="grid size-9 shrink-0 place-items-center border border-black transition-colors hover:bg-black hover:text-white">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>

          <div className="flex items-baseline justify-between border-y border-black py-3">
            <span className="font-mono text-xl">{formatPrice(product)}</span>
            <span className="font-mono text-[12px] text-black/60">
              {product.rating.toFixed(1)} / 5 ({product.reviewCount})
            </span>
          </div>

          {product.sizes.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-black/50">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-11 border px-3 py-2 text-[13px] transition-colors ${size === s ? 'border-black bg-black text-white' : 'border-black/25 hover:border-black'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[14px] leading-relaxed text-black/70">{shortDescription(product)}</p>

          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <span key={t} className="border border-black/20 px-2 py-0.5 font-mono text-[11px] text-black/60">
                #{t}
              </span>
            ))}
          </div>

          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className={`mt-auto flex items-center justify-between border border-black px-5 py-4 text-[15px] transition-colors ${product.inStock ? 'bg-black text-white hover:bg-white hover:text-black' : 'pointer-events-none opacity-40'}`}
          >
            <span>{product.inStock ? (size ? `Buy size ${size}` : 'View on Nike') : 'Sold out'}</span>
            <span aria-hidden>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  )
}
