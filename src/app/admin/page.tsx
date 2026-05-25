"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Order, OrderStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusUpdateModal } from "@/components/admin/StatusUpdateModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportOrders, ExportFormat } from "@/lib/export"

const statusFilters: (OrderStatus | "ALL")[] = [
  "ALL",
  "pending",
  "confirmed",
  "processing",
  "out_for_delivery",
  "delivered",
]

export default function AdminOrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    deliveredToday: 0,
  })

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setOrders(data as Order[])
      }
      setLoading(false)
    }

    fetchOrders()
  }, [supabase])

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setStats({
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      inProgress: orders.filter(
        (o) => o.status === "confirmed" || o.status === "processing"
      ).length,
      deliveredToday: orders.filter(
        (o) => o.status === "delivered" && o.updated_at.split("T")[0] === today
      ).length,
    })
  }, [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter
      const matchesSearch =
        searchQuery === "" ||
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [orders, statusFilter, searchQuery])

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus } as never)
      .eq("id", orderId)

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
  }

  const getStatusBadgeClass = (status: OrderStatus) => {
    const base = "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
    switch (status) {
      case "pending":
        return `${base} bg-[var(--color-amber-light)] text-[var(--color-amber)]`
      case "confirmed":
        return `${base} bg-[var(--color-blue-light)] text-[var(--color-blue)]`
      case "processing":
        return `${base} bg-[var(--color-purple-light)] text-[var(--color-purple)]`
      case "out_for_delivery":
        return `${base} bg-[var(--color-orange-light)] text-[var(--color-orange)]`
      case "delivered":
        return `${base} bg-[var(--color-accent-light)] text-[var(--color-accent)]`
      default:
        return base
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-deep-leaf)] mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Orders", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "In Progress", value: stats.inProgress },
            { label: "Delivered Today", value: stats.deliveredToday },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] bg-white border border-[var(--color-field-border)] p-4 shadow-[var(--shadow-sm)]"
            >
              <p className="text-xs font-bold uppercase tracking-tight text-[var(--color-text-muted)] mb-1">
                {stat.label}
              </p>
              <p className="font-heading text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="border-b border-[var(--color-field-border)] mb-6"></div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-wrap gap-1">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-tight transition-colors ${
                  statusFilter === status
                    ? "bg-black text-white"
                    : "bg-[var(--color-surface)] border border-[var(--color-field-border)] hover:bg-white"
                }`}
              >
                {status === "ALL" ? "All" : status.replace(/_/g, " ")}
              </button>
            ))}
          </div>
          <div className="md:ml-auto flex items-center gap-3">
            {filteredOrders.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger>Export</DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportOrders(orders, "csv")}>
                    Download CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportOrders(orders, "xlsx")}>
                    Download Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportOrders(orders, "pdf")}>
                    Download PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Input
              type="text"
              placeholder="Search by order no. or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)]">
              No orders found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[20px] border border-[var(--color-field-border)] bg-white shadow-[var(--shadow-sm)]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-field-border)] bg-[var(--color-fresh-mist)]">
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-left py-3 pr-4">
                    Order No.
                  </th>
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-left py-3 pr-4">
                    Customer
                  </th>
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-left py-3 pr-4">
                    Email
                  </th>
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-left py-3 pr-4">
                    Phone
                  </th>
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-left py-3 pr-4">
                    Date
                  </th>
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-left py-3 pr-4">
                    Items
                  </th>
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-left py-3 pr-4">
                    Status
                  </th>
                  <th className="text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)] text-left py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--color-field-border)]"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-sm hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-sm">{order.customer_name}</td>
                    <td className="py-3 pr-4 text-sm">{order.customer_email}</td>
                    <td className="py-3 pr-4 text-sm">{order.customer_phone || "-"}</td>
                    <td className="py-3 pr-4 text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3 pr-4 text-sm">
                      {order.order_items?.length || 0}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="link" size="sm" className="p-0 font-heading uppercase tracking-tight text-xs">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
