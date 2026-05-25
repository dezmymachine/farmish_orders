"use client"

import { useMemo, useState } from "react"
import { Minus, Plus, Search } from "lucide-react"
import { Product, CartItem } from "@/types"
import { Input } from "@/components/ui/input"

interface ProductGridProps {
  products: Product[]
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

export function ProductGrid({ products, cart, setCart }: ProductGridProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const quantities: Record<string, number> = useMemo(() => {
    const q: Record<string, number> = {}
    cart.forEach((item) => {
      if (item.product) {
        q[item.product.id] = item.quantity
      }
    })
    return q
  }, [cart])

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.filter((p) => p.available).map((p) => p.category))).sort()]
  }, [products])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products
      .filter((p) => p.available)
      .filter((p) => activeCategory === "All" || p.category === activeCategory)
      .filter((p) => !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
  }, [products, activeCategory, search])

  const setQuantity = (product: Product, quantity: number) => {
    const qty = Math.max(0, quantity)
    setCart((prev) => {
      const existing = prev.find((item) => item.product?.id === product.id)
      if (qty <= 0) {
        return prev.filter((item) => item.product?.id !== product.id)
      }
      if (existing) {
        return prev.map((item) =>
          item.product?.id === product.id ? { ...item, quantity: qty } : item
        )
      }
      return [...prev, { product, quantity: qty }]
    })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-[var(--color-field-border)] bg-[var(--color-fresh-mist)] p-4 md:p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-leaf)]" size={18} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tomatoes, maize, ginger..."
            className="h-12 bg-white pl-11"
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                activeCategory === category
                  ? "border-[var(--color-farm-green)] bg-[var(--color-farm-green)] text-white"
                  : "border-[var(--color-field-border)] bg-white text-[var(--color-muted-leaf)] hover:text-[var(--color-farm-green)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[var(--color-field-border)] bg-white p-8 text-center">
          <p className="font-semibold text-[var(--color-deep-leaf)]">No matching produce found</p>
          <p className="mt-2 text-sm text-[var(--color-muted-leaf)]">Use the custom item option in your order summary.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const qty = quantities[product.id] || 0
            const selected = qty > 0
            return (
              <div
                key={product.id}
                className={`rounded-[20px] border p-4 shadow-[var(--shadow-sm)] transition-all ${
                  selected
                    ? "border-[var(--color-farm-green)] bg-[var(--color-fresh-mist)]"
                    : "border-[var(--color-field-border)] bg-white hover:border-[var(--color-farm-green)]/30"
                }`}
              >
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{product.name}</p>
                  <p className="mt-1 text-xs font-medium text-[var(--color-muted-leaf)]">{product.category} • per {product.unit}</p>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <div className="flex items-center rounded-full border border-[var(--color-field-border)] bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(product, qty - 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-muted-leaf)] hover:bg-[var(--color-fresh-mist)] hover:text-[var(--color-farm-green)]"
                      aria-label={`Decrease ${product.name}`}
                    >
                      <Minus size={15} />
                    </button>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={qty || ""}
                      onChange={(e) => setQuantity(product, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="h-8 w-12 border-0 bg-transparent text-center text-sm font-semibold outline-none focus:ring-0"
                      aria-label={`${product.name} quantity`}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(product, qty + 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-farm-green)] text-white hover:bg-[var(--color-deep-leaf)]"
                      aria-label={`Increase ${product.name}`}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
