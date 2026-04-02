"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Order, OrderItem, OrderStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { StatusUpdateModal } from "@/components/admin/StatusUpdateModal"

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "out_for_delivery",
  "delivered",
]

export default function AdminOrderDetailPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const supabase = createClient()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single()

      if (!error && data) {
        setOrder(data as Order)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [orderId, supabase])

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus } as never)
      .eq("id", orderId)

    if (!error && order) {
      setOrder({ ...order, status: newStatus })
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-[var(--color-bg)] p-6">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-[var(--color-bg)] p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p>Order not found</p>
          <Link href="/admin">
            <Button variant="link" className="font-heading uppercase tracking-wider">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentStatusIndex = statusOrder.indexOf(order.status)

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[var(--color-bg)] p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin"
          className="inline-block mb-4 font-heading text-sm uppercase tracking-wider text-[var(--color-accent)] hover:underline"
        >
          ← Back to Orders
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">
              Order Details
            </h1>
            <span className="font-mono text-lg">{order.order_number}</span>
          </div>
          <StatusUpdateModal
            orderId={order.id}
            currentStatus={order.status}
            onUpdate={handleStatusUpdate}
          />
        </div>

        <div className="border-b-4 border-black mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-heading text-lg font-semibold uppercase tracking-wider mb-4 border-b border-[var(--color-border-light)] pb-2">
              Customer Information
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-heading text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                  Name
                </p>
                <p>{order.customer_name}</p>
              </div>
              <div>
                <p className="font-heading text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                  Email
                </p>
                <p>{order.customer_email}</p>
              </div>
              <div>
                <p className="font-heading text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                  Phone
                </p>
                <p>{order.customer_phone || "N/A"}</p>
              </div>
            </div>

            <h2 className="font-heading text-lg font-semibold uppercase tracking-wider mt-8 mb-4 border-b border-[var(--color-border-light)] pb-2">
              Delivery Information
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-heading text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                  Address
                </p>
                <p>{order.delivery_address}</p>
              </div>
              {order.delivery_notes && (
                <div>
                  <p className="font-heading text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    Notes
                  </p>
                  <p>{order.delivery_notes}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold uppercase tracking-wider mb-4 border-b border-[var(--color-border-light)] pb-2">
              Order Items
            </h2>
            <table className="w-full border-collapse mb-8">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-left py-2 pr-4">
                    Product
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-2 pr-4">
                    Quantity
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-2">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.order_items?.map((item: OrderItem) => (
                  <tr key={item.id} className="border-b border-[var(--color-border-light)]">
                    <td className="py-3 pr-4 text-sm">{item.product_name}</td>
                    <td className="py-3 pr-4 text-sm text-right">{item.quantity}</td>
                    <td className="py-3 text-sm text-right">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="font-heading text-lg font-semibold uppercase tracking-wider mb-4 border-b border-[var(--color-border-light)] pb-2">
              Order Status
            </h2>
            <div className="space-y-4">
              {statusOrder.map((status, index) => {
                const isCompleted = index < currentStatusIndex
                const isCurrent = index === currentStatusIndex
                return (
                  <div
                    key={status}
                    className={`flex items-start gap-3 ${
                      isCompleted || isCurrent
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-text-muted)]"
                    } ${isCurrent ? "font-semibold" : ""}`}
                  >
                    <div
                      className={`w-3 h-3 mt-1 shrink-0 ${
                        isCompleted || isCurrent
                          ? "bg-[var(--color-accent)]"
                          : "bg-[var(--color-border-light)]"
                      }`}
                    />
                    <div>
                      <p className="font-heading text-sm uppercase tracking-wider">
                        {status.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
