"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Product, CartItem } from "@/types"
import { ProductGrid } from "@/components/order-form/ProductGrid"
import { CartSidebar } from "@/components/order-form/CartSidebar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function OrderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [errorDialog, setErrorDialog] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .order("category", { ascending: true })
        .order("name", { ascending: true })

      if (!error && data) {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [supabase])

  const handleSubmit = async (address: string, notes: string) => {
    setSubmitting(true)

    try {
      const items = cart.map((item) => ({
        product_id: item.product?.id || null,
        product_name: item.product?.name || item.custom_name || "",
        unit: item.product?.unit || item.custom_unit || "",
        quantity: item.quantity,
      }))

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          delivery_address: address,
          delivery_notes: notes,
        }),
      })

      const result = await response.json()

      if (result.error) {
        setErrorDialog(result.error)
        setSubmitting(false)
        return
      }

      setOrderNumber(result.data.order_number)
      setSuccess(true)
    } catch {
      setErrorDialog("Failed to submit order. Please try again.")
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-6">
        <div className="max-w-md text-center">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border-light)] p-8">
            <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-4">
              Order Received
            </h1>
            <p className="font-mono text-xl mb-4">{orderNumber}</p>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Your order has been received. We will review it and send you a quote
              shortly.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center justify-center border-2 border-black bg-black text-white px-6 py-2 font-heading uppercase tracking-wider text-sm font-semibold hover:bg-[var(--color-text-primary)] transition-colors"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-6">
              Place Your Order
            </h1>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} cart={cart} setCart={setCart} />
            )}
          </div>
          <div className="lg:col-span-2">
            <CartSidebar cart={cart} setCart={setCart} onSubmit={handleSubmit} isSubmitting={submitting} />
          </div>
        </div>
      </div>

      <Dialog open={!!errorDialog} onOpenChange={() => setErrorDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorDialog}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorDialog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg)] p-6">Loading...</div>}>
      <OrderContent />
    </Suspense>
  )
}
