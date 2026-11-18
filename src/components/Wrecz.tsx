import { useEffect, useRef, useState } from 'react'
import { formatPrice, products, recommend, type Product } from '@/lib/products'

type Msg = { from: 'user' | 'wrecz'; text: string; items?: Product[]; isAI?: boolean }

const suggestions = ['Running shoes under $120', "Women's hoodie", 'Lightweight shorts', 'Jersey for kids']

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2 19.5 21 12 16.8 4.5 21Z" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function Wrecz({
  onOpenProduct,
  onFilterCatalog,
}: {
  onOpenProduct: (p: Product) => void
  onFilterCatalog?: (productIds: string[], label: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: 'wrecz',
      text: "I'm Wrecz, your Nike AI stylist. Tell me what you're training for, your budget or a style, and I'll pull live picks from the catalogue.",
    },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const ask = async (text: string) => {
    const q = text.trim()
    if (!q || loading) return

    setMessages((m) => [...m, { from: 'user', text: q }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`)
      }

      const data = await res.json()
      const recommendedIds: string[] = data.recommendedIds || []
      const note: string = data.note || 'Here are the recommended picks.'

      // Map IDs back to full product objects
      const items = products.filter((p) => recommendedIds.includes(p.id))

      setMessages((m) => [...m, { from: 'wrecz', text: note, items, isAI: true }])
    } catch (err) {
      console.warn('API call failed or offline, using fallback:', err)
      // Seamless fallback to local heuristic
      const { items, note } = recommend(q)
      setMessages((m) => [...m, { from: 'wrecz', text: note, items, isAI: false }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <div className="animate-rise fixed inset-x-3 bottom-28 z-40 mx-auto flex max-h-[min(580px,75dvh)] max-w-[440px] flex-col border border-black bg-white shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center justify-between border-b border-black px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-black" />
              <span className="font-mono text-[12px] uppercase tracking-wider">Wrecz / AI stylist</span>
            </div>
            <button onClick={() => setOpen(false)} className="font-mono text-[12px] uppercase hover:underline">
              Close
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'flex justify-end' : ''}>
                <div className={m.from === 'user' ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-black px-3.5 py-2 text-[14px] leading-relaxed text-white' : 'space-y-2'}>
                  <p className={m.from === 'user' ? '' : 'text-[14px] leading-relaxed text-black/85'}>{m.text}</p>

                  {m.items && m.items.length > 0 && (
                    <div className="mt-3">
                      <div className="grid grid-cols-2 gap-px border border-black bg-black">
                        {m.items.map((p) => (
                          <button key={p.id} onClick={() => onOpenProduct(p)} className="flex flex-col bg-white p-2 text-left transition-colors hover:bg-paper">
                            <img src={p.image} alt="" className="aspect-square w-full bg-paper object-contain p-2 mix-blend-multiply" />
                            <span className="mt-2 line-clamp-1 text-[12px] font-medium">{p.name}</span>
                            <span className="font-mono text-[11px] text-black/60">{formatPrice(p)}</span>
                          </button>
                        ))}
                      </div>

                      {onFilterCatalog && (
                        <button
                          onClick={() => {
                            onFilterCatalog(
                              m.items!.map((it) => it.id),
                              m.text,
                            )
                            setOpen(false)
                          }}
                          className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-black underline underline-offset-4 hover:opacity-70"
                        >
                          <span>Filter store grid with these picks</span>
                          <span>&rarr;</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 py-2 text-black/60">
                <span className="size-2 rounded-full bg-black animate-ping" />
                <span className="font-mono text-[12px] uppercase">Wrecz is diggin...</span>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="rounded-full border border-black/25 px-3 py-1.5 text-[12px] hover:border-black">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
            className="flex border-t border-black"
          >
            <input
              ref={inputRef}
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              placeholder={loading ? 'Wrecz is diggin...' : 'Ask Wrecz anything (e.g. shoes under $100)...'}
              className="flex-1 bg-transparent px-4 py-3 text-[14px] outline-none placeholder:text-black/40 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="border-l border-black px-4 font-mono text-[12px] uppercase hover:bg-black hover:text-white disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="wrecz-pill pointer-events-auto flex h-[60px] items-center gap-5 rounded-full pl-7 pr-[7px] text-white transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          <span className="text-[19px] tracking-[-0.01em]">{open ? 'Close Wrecz' : 'Ask Wrecz'}</span>
          <span className="wrecz-knob grid size-[46px] place-items-center rounded-full text-black">
            <span className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-45'}`}>
              <Arrow />
            </span>
          </span>
        </button>
      </div>
    </>
  )
}
