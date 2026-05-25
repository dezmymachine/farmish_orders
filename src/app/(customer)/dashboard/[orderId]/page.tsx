"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Order, OrderItem, OrderStatus } from "@/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportSingleOrder, ExportFormat } from "@/lib/export"

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "out_for_delivery",
  "delivered",
]

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const supabase = createClient()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single()

      if (!error && data) {
        setOrder(data as Order)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [orderId, supabase])

  const getStatusClass = (status: OrderStatus, isCompleted: boolean, isCurrent: boolean) => {
    const base = "flex items-start gap-3"
    if (isCompleted) {
      return `${base} text-[var(--color-farm-green)]`
    }
    if (isCurrent) {
      return `${base} text-[var(--color-farm-green)] font-semibold`
    }
    return `${base} text-[var(--color-muted-leaf)]`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-4xl">Loading...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white px-4 py-6 lg:px-8 lg:py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>Order not found</p>
          <Link href="/dashboard">
            <Button variant="link" className="font-heading uppercase tracking-tight">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentStatusIndex = statusOrder.indexOf(order.status)

  return (
    <div className="min-h-screen bg-white px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="mb-4 inline-block text-sm font-semibold text-[var(--color-farm-green)] hover:underline"
        >
          Back to orders
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-deep-leaf)]">
              Order Details
            </h1>
            <span className="font-mono text-lg">{order.order_number}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>Export</DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportSingleOrder(order, "csv")}>
                Download CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportSingleOrder(order, "xlsx")}>
                Download Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportSingleOrder(order, "pdf")}>
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>



        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 border-b border-[var(--color-field-border)] pb-3 text-lg font-semibold text-[var(--color-deep-leaf)]">
              Order Items
            </h2>
            <table className="w-full border-collapse rounded-[20px] bg-white">
              <thead>
                <tr className="border-b border-[var(--color-field-border)] bg-[var(--color-fresh-mist)]">
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-left py-2 pr-4">
                    Product
                  </th>
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-right py-2 pr-4">
                    Quantity
                  </th>
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-right py-2">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.order_items?.map((item: OrderItem) => (
                  <tr key={item.id} className="border-b border-[var(--color-field-border)]">
                    <td className="py-3 pr-4 text-sm">{item.product_name}</td>
                    <td className="py-3 pr-4 text-sm text-right">{item.quantity}</td>
                    <td className="py-3 text-sm text-right">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="mb-4 border-b border-[var(--color-field-border)] pb-3 text-lg font-semibold text-[var(--color-deep-leaf)]">
              Delivery Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-heading text-xs uppercase tracking-tight text-[var(--color-muted-leaf)] mb-1">
                  Address
                </p>
                <p className="text-sm">{order.delivery_address}</p>
              </div>
              {order.delivery_notes && (
                <div>
                  <p className="font-heading text-xs uppercase tracking-tight text-[var(--color-muted-leaf)] mb-1">
                    Notes
                  </p>
                  <p className="text-sm">{order.delivery_notes}</p>
                </div>
              )}
            </div>

            <h2 className="font-heading text-lg font-semibold uppercase tracking-tight mt-8 mb-4 border-b border-[var(--color-field-border)] pb-2">
              Order Status
            </h2>
            <div className="space-y-4">
              {statusOrder.map((status, index) => {
                const isCompleted = index < currentStatusIndex
                const isCurrent = index === currentStatusIndex
                return (
                  <div
                    key={status}
                    className={getStatusClass(status, isCompleted, isCurrent)}
                  >
                    <div
                      className={`w-3 h-3 mt-1 shrink-0 ${
                        isCompleted || isCurrent
                          ? "bg-[var(--color-farm-green)]"
                          : "bg-[var(--color-border-light)]"
                      }`}
                    />
                    <div>
                      <p className="font-heading text-sm uppercase tracking-tight">
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
