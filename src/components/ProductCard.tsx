import { formatPrice, type Product } from '@/lib/products'

export default function ProductCard({ product, index, onOpen }: { product: Product; index: number; onOpen: (p: Product) => void }) {
  return (
    <button onClick={() => onOpen(product)} className="group flex flex-col bg-white text-left outline-none focus-visible:bg-paper">
      <div className="relative aspect-square overflow-hidden bg-paper">
        <span className="absolute left-3 top-3 z-10 font-mono text-[11px] text-black/50">{String(index + 1).padStart(3, '0')}</span>
        {!product.inStock && (
          <span className="absolute right-3 top-3 z-10 bg-black px-2 py-0.5 font-mono text-[10px] uppercase text-white">Sold out</span>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-black p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-snug">{product.name}</h3>
          <span className="shrink-0 font-mono text-[13px]">{formatPrice(product)}</span>
        </div>
        <p className="text-[13px] text-black/55">{product.subTitle}</p>
      </div>
    </button>
  )
}
