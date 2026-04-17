"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Order, OrderItem, OrderStatus, Quote } from "@/types"
import { Button } from "@/components/ui/button"
import { StatusUpdateModal } from "@/components/admin/StatusUpdateModal"
import { QuoteModal } from "@/components/admin/QuoteModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportSingleOrder } from "@/lib/export"

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
  const [quotes, setQuotes] = useState<Quote[]>([])
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

  useEffect(() => {
    if (!orderId) return

    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*, quote_items(*)")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setQuotes(data as Quote[])
      }
    }

    fetchQuotes()
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
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger>Export</DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => order && exportSingleOrder(order, "csv")}>
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => order && exportSingleOrder(order, "xlsx")}>
                  Download Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => order && exportSingleOrder(order, "pdf")}>
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <QuoteModal
              orderId={order.id}
              orderItems={order.order_items || []}
              customerEmail={order.customer_email}
            />
            <StatusUpdateModal
              orderId={order.id}
              currentStatus={order.status}
              onUpdate={handleStatusUpdate}
            />
          </div>
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

            {quotes.length > 0 && (
              <>
                <h2 className="font-heading text-lg font-semibold uppercase tracking-wider mt-8 mb-4 border-b border-[var(--color-border-light)] pb-2">
                  Quotes
                </h2>
                {quotes.map((quote) => {
                  const subtotal = quote.quote_items?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0
                  const serviceFee = (quote as any).service_fee || subtotal * 0.05
                  const transport = (quote as any).transport || 0
                  return (
                    <div
                      key={quote.id}
                      className="bg-white border-2 border-black p-4 mb-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-heading text-sm uppercase tracking-wider">
                          Quote {quote.id.slice(0, 8)}
                        </span>
                        <span className="font-mono text-lg font-bold">
                          GH₵{quote.total_amount?.toFixed(2) ?? '0.00'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mb-3">
                        Created: {new Date(quote.created_at).toLocaleDateString("en-GB")}
                      </p>
                      <div className="overflow-x-auto">
                      {quote.quote_items && quote.quote_items.length > 0 && (
                        <table className="w-full border-collapse min-w-[700px]">
                          <thead>
                            <tr className="border-b border-gray-300">
                              <th className="text-left text-xs font-heading uppercase tracking-wider py-2 pr-4">
                                Product
                              </th>
                              <th className="text-right text-xs font-heading uppercase tracking-wider py-2 pr-4">
                                Qty
                              </th>
                              <th className="text-left text-xs font-heading uppercase tracking-wider py-2 pr-4">
                                District
                              </th>
                              <th className="text-right text-xs font-heading uppercase tracking-wider py-2 pr-4">
                                Unit Price
                              </th>
                              <th className="text-right text-xs font-heading uppercase tracking-wider py-2">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {quote.quote_items.map((item) => (
                              <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-2 pr-4 text-sm">{(item as any).product_name || 'Unknown'}</td>
                                <td className="py-2 pr-4 text-sm text-right">{item.quantity}</td>
                                <td className="py-2 pr-4 text-sm">{(item as any).district || '-'}</td>
                                <td className="py-2 pr-4 text-sm text-right">GH₵{(item.unit_price ?? item.custom_price ?? 0).toFixed(2)}</td>
                                <td className="py-2 text-sm text-right">GH₵{item.total_price?.toFixed(2) ?? '0.00'}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={4} className="py-2 text-right text-sm font-semibold uppercase tracking-wider">
                                Subtotal
                              </td>
                              <td className="py-2 text-right text-sm font-bold">
                                GH₵{subtotal.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4} className="py-2 text-right text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
                                Service Fee (5%)
                              </td>
                              <td className="py-2 text-right text-sm text-[var(--color-text-secondary)]">
                                GH₵{serviceFee.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4} className="py-2 text-right text-sm font-semibold uppercase tracking-wider">
                                Transport
                              </td>
                              <td className="py-2 text-right text-sm">
                                GH₵{transport.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      )}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
