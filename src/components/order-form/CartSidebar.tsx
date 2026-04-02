"use client"

import { CartItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
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

  const handleSubmit = () => {
    if (cart.length === 0) {
      setError("Please add at least one item to your order")
      return
    }
    if (!deliveryAddress.trim()) {
      setError("Delivery address is required")
      return
    }
    setError("")
    onSubmit(deliveryAddress, notes)
  }

  const handleRemove = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddCustom = (item: CartItem) => {
    setCart((prev) => [...prev, item])
  }

  return (
    <div className="sticky top-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-light)] p-4">
        <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-4 border-b border-[var(--color-border-light)] pb-2">
          Your Order
        </h2>

        {cart.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] py-4">
            No items selected
          </p>
        ) : (
          <div className="space-y-3 mb-4">
            {cart.map((item, index) => (
              <div
                key={`${item.product?.id || item.custom_name}-${index}`}
                className="flex justify-between items-start py-2 border-b border-[var(--color-border-light)]"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {item.product?.name || item.custom_name}
                    {!item.product && (
                      <span className="ml-1 text-[10px] text-[var(--color-accent)] uppercase tracking-wider">
                        (custom)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {item.quantity} {item.product?.unit || item.custom_unit}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] text-sm ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 pb-3">
          <CustomItemForm onAdd={handleAddCustom} />
        </div>

        <div className="space-y-3 pt-4 border-t border-[var(--color-border-light)]">
          <div>
            <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
              Delivery Address
            </label>
            <Textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
              className="min-h-[80px]"
            />
          </div>

          <div>
            <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
              Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
              className="min-h-[60px]"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-danger)]">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full uppercase tracking-widest font-heading font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit Order"}
          </Button>
        </div>
      </div>
    </div>
  )
}
