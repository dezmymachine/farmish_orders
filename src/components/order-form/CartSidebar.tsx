"use client"

import { useState } from "react"
import { ChevronDown, ShoppingBasket, Trash2 } from "lucide-react"
import { CartItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CustomItemForm } from "./CustomItemForm"

interface CartSidebarProps {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  onSubmit: (address: string, notes: string) => void
  isSubmitting: boolean
}

export function CartSidebar({ cart, setCart, onSubmit, isSubmitting }: CartSidebarProps) {
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSubmit = () => {
    if (cart.length === 0) {
      setError("Please add at least one item to your order")
      setMobileOpen(true)
      return
    }
    if (!deliveryAddress.trim()) {
      setError("Delivery address is required")
      setMobileOpen(true)
      return
    }
    setError("")
    onSubmit(deliveryAddress, notes)
  }

  const handleRemove = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  const content = (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-deep-leaf)]">Your request</h2>
          <span className="rounded-full bg-[var(--color-fresh-mist)] px-3 py-1 text-xs font-semibold text-[var(--color-farm-green)]">{cart.length} items</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted-leaf)]">You will receive a quote before making any payment.</p>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-[var(--color-field-border)] bg-[var(--color-fresh-mist)] p-5 text-sm text-[var(--color-muted-leaf)]">
          No items selected yet. Add produce from the list or request a custom item.
        </div>
      ) : (
        <div className="max-h-[34vh] space-y-2 overflow-y-auto pr-1 lg:max-h-none">
          {cart.map((item, index) => (
            <div key={`${item.product?.id || item.custom_name}-${index}`} className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--color-field-border)] bg-white p-3">
              <div className="min-w-0">
                <p className="font-semibold text-[var(--color-ink)]">
                  {item.product?.name || item.custom_name}
                  {!item.product && <span className="ml-2 rounded-full bg-[var(--color-harvest-cream)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--color-soil-brown)]">custom</span>}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted-leaf)]">{item.quantity} {item.product?.unit || item.custom_unit}</p>
              </div>
              <button onClick={() => handleRemove(index)} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-muted-leaf)] hover:bg-[var(--color-danger-light)] hover:text-[var(--color-error-red)]" aria-label="Remove item">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[20px] border border-[var(--color-field-border)] bg-[var(--color-fresh-mist)] p-4">
        <CustomItemForm onAdd={(item) => setCart((prev) => [...prev, item])} />
      </div>

      <div className="space-y-4 border-t border-[var(--color-field-border)] pt-5">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-tight text-[var(--color-text-secondary)]">Delivery address</label>
          <Textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Enter delivery address, district, landmark or contact details" className="min-h-[96px]" />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-tight text-[var(--color-text-secondary)]">Notes (optional)</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferred delivery timing, packaging, substitutions..." className="min-h-[80px]" />
        </div>

        {error && <p className="rounded-2xl bg-[var(--color-danger-light)] px-4 py-3 text-sm text-[var(--color-error-red)]">{error}</p>}

        <Button onClick={handleSubmit} disabled={isSubmitting} className="h-12 w-full">
          {isSubmitting ? "Submitting request..." : "Submit quote request"}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:sticky lg:top-6 lg:block">
        <div className="rounded-[24px] border border-[var(--color-field-border)] bg-white p-5 shadow-[var(--shadow-md)]">
          {content}
        </div>
      </aside>

      <div className="lg:hidden">
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-[var(--shadow-lg)]" onClick={(e) => e.stopPropagation()}>
              <button className="mx-auto mb-4 flex h-1.5 w-12 rounded-full bg-[var(--color-field-border)]" onClick={() => setMobileOpen(false)} aria-label="Close order summary" />
              {content}
            </div>
          </div>
        )}

        <div className="fixed inset-x-0 bottom-[64px] z-40 px-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex w-full items-center justify-between rounded-full bg-[var(--color-farm-green)] px-5 py-4 text-left text-white shadow-[var(--shadow-lg)]"
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <ShoppingBasket size={18} /> View request ({cart.length})
            </span>
            <ChevronDown className="rotate-180" size={18} />
          </button>
        </div>
      </div>
    </>
  )
}
