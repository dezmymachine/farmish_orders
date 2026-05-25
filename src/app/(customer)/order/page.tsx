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
      <div className="min-h-screen bg-white px-5 py-12 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center text-center">
          <div className="rounded-[28px] border border-[var(--color-field-border)] bg-white p-7 shadow-[var(--shadow-lg)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-fresh-mist)] text-[var(--color-farm-green)]">
              ✓
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-deep-leaf)]">Request received</h1>
            <p className="mt-3 font-mono text-lg text-[var(--color-farm-green)]">{orderNumber}</p>
            <p className="mt-4 text-[var(--color-muted-leaf)]">
              Your produce request has been received. Farmish will review availability and send you a clear quote before any payment.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-farm-green)] px-6 text-sm font-semibold text-white shadow-[var(--shadow-md)] hover:bg-[var(--color-deep-leaf)]"
            >
              View my orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 rounded-[28px] border border-[var(--color-field-border)] bg-white p-5 shadow-[var(--shadow-sm)] lg:p-6">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-deep-leaf)] lg:text-4xl">Place your order</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 xl:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-[20px]" />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} cart={cart} setCart={setCart} />
            )}
          </div>
          <div className="lg:col-span-2 xl:col-span-2">
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
    <Suspense fallback={<div className="min-h-screen bg-white p-6">Loading...</div>}>
      <OrderContent />
    </Suspense>
  )
}
