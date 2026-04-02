"use client"

import { useState, useEffect, useMemo } from "react"
import { Product, CartItem } from "@/types"
import { Input } from "@/components/ui/input"

interface ProductGridProps {
  products: Product[]
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

export function ProductGrid({ products, cart, setCart }: ProductGridProps) {
  const quantities: Record<string, number> = useMemo(() => {
    const q: Record<string, number> = {}
    cart.forEach((item) => {
      if (item.product) {
        q[item.product.id] = item.quantity
      }
    })
    return q
  }, [cart])

  const handleQuantityChange = (product: Product, value: string) => {
    const qty = parseFloat(value) || 0
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (qty <= 0) {
        return prev.filter((item) => item.product.id !== product.id)
      }
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: qty } : item
        )
      }
      return [...prev, { product, quantity: qty }]
    })
  }

  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {}
    products
      .filter((p) => p.available)
      .forEach((product) => {
        if (!groups[product.category]) {
          groups[product.category] = []
        }
        groups[product.category].push(product)
      })
    return groups
  }, [products])

  const categories = Object.keys(groupedProducts).sort()

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="font-heading text-lg font-semibold uppercase tracking-wider border-b-2 border-black pb-2 mb-4">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedProducts[category].map((product) => (
              <div
                key={product.id}
                className={`flex items-center justify-between p-3 border border-[var(--color-border-light)] ${
                  quantities[product.id] > 0 ? "bg-[var(--color-accent-light)]" : ""
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    per {product.unit}
                  </p>
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={quantities[product.id] || ""}
                    onChange={(e) => handleQuantityChange(product, e.target.value)}
                    placeholder="0"
                    className="text-right h-8"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
