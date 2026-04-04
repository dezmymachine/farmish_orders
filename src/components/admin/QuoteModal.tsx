"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { OrderItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface QuoteModalProps {
  orderId: string
  orderItems: OrderItem[]
  customerEmail: string
  onSuccess?: () => void
}

interface QuoteItem {
  order_item_id: string
  product_name: string
  unit: string
  quantity: number
  unit_price: number
  total: number
}

export function QuoteModal({
  orderId,
  orderItems,
  customerEmail,
  onSuccess,
}: QuoteModalProps) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<QuoteItem[]>([])
  const [notes, setNotes] = useState("")
  const [existingQuote, setExistingQuote] = useState<any>(null)

  useEffect(() => {
    if (open) {
      fetchExistingQuote()
    }
  }, [open, orderId])

  const fetchExistingQuote = async () => {
    const response = await fetch(`/api/orders/${orderId}/quote`)
    const result = await response.json()
    if (result.data) {
      setExistingQuote(result.data)
      setItems(
        result.data.quote_items.map((item: any) => ({
          order_item_id: item.order_item_id,
          product_name: item.product_name,
          unit: item.unit,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total_price,
        }))
      )
    } else {
      setItems(
        orderItems.map((item) => ({
          order_item_id: item.id,
          product_name: item.product_name,
          unit: item.unit,
          quantity: item.quantity,
          unit_price: 0,
          total: 0,
        }))
      )
    }
  }

  const handlePriceChange = (index: number, value: string) => {
    const price = parseFloat(value) || 0
    setItems((prev) => {
      const updated = [...prev]
      updated[index].unit_price = price
      updated[index].total = price * updated[index].quantity
      return updated
    })
  }

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = async () => {
    if (items.every((item) => item.unit_price <= 0)) {
      alert("Please enter at least one unit price")
      return
    }

    setLoading(true)
    try {
      const quoteItems = items
        .filter((item) => item.unit_price > 0)
        .map((item) => ({
          order_item_id: item.order_item_id,
          product_name: item.product_name,
          unit: item.unit,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))

      const response = await fetch(`/api/orders/${orderId}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: quoteItems,
          notes: notes || undefined,
        }),
      })

      const result = await response.json()

      if (result.error) {
        alert(result.error)
        return
      }

      setOpen(false)
      setNotes("")
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error creating quote:", error)
      alert("Failed to create quote")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="font-heading uppercase tracking-wider text-xs"
      >
        {existingQuote ? "View/Edit Quote" : "Create Quote"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-wider">
              {existingQuote ? "Quote Details" : "Create Quote"} - {customerEmail}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-left py-2 pr-4">
                    Product
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-2 pr-4">
                    Qty
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-2 pr-4">
                    Unit
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-2 pr-4">
                    Unit Price
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-2">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.order_item_id} className="border-b border-[var(--color-border-light)]">
                    <td className="py-3 pr-4 text-sm">{item.product_name}</td>
                    <td className="py-3 pr-4 text-sm text-right">{item.quantity}</td>
                    <td className="py-3 pr-4 text-sm text-right">{item.unit}</td>
                    <td className="py-3 pr-4">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price || ""}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        placeholder="0.00"
                        className="text-right h-8 w-28 ml-auto"
                      />
                    </td>
                    <td className="py-3 text-sm text-right font-medium">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="py-4 text-right font-heading text-sm font-semibold uppercase tracking-wider">
                    Total Amount
                  </td>
                  <td className="py-4 text-right font-heading text-base font-bold text-[var(--color-accent)]">
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div>
              <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
                Notes (Optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes for the customer..."
                className="min-h-[80px]"
              />
            </div>

            {existingQuote && (
              <div className="text-xs text-[var(--color-text-muted)]">
                Quote created on{" "}
                {new Date(existingQuote.created_at).toLocaleDateString("en-GB")}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || items.every((item) => item.unit_price <= 0)}
            >
              {loading
                ? "Sending..."
                : existingQuote
                ? "Update & Send Quote"
                : "Create & Send Quote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}