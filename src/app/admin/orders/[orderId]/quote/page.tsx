"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { OrderItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { Toast, useToast, ToastContainer } from "@/components/ui/toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportQuote } from "@/lib/export"
import ghanaDistricts from "@/data/ghana-districts.json"

function QuotePageWithToast() {
  const { toast, showToast, hideToast } = useToast()

  return (
    <>
      <QuotePageContent showToast={showToast} />
      <ToastContainer toast={toast} onClose={hideToast} />
    </>
  )
}

interface QuotePageContentProps {
  showToast?: (message: string, type: "success" | "error") => void
}

function QuotePageContent({ showToast: externalShowToast }: QuotePageContentProps) {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<QuoteItem[]>([])
  const [notes, setNotes] = useState("")
  const [transport, setTransport] = useState("")
  const [existingQuote, setExistingQuote] = useState<any>(null)
  const [districtSearch, setDistrictSearch] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [customerName, setCustomerName] = useState("")

  if (!externalShowToast) {
    const { showToast: intShowToast } = useToast()
    externalShowToast = intShowToast
  }

  const filteredDistricts = useMemo(() => {
    if (!districtSearch.trim()) return ghanaDistricts
    const search = districtSearch.toLowerCase()
    return ghanaDistricts
      .map((region) => ({
        region: region.region,
        districts: region.districts.filter((d) => d.toLowerCase().includes(search)),
      }))
      .filter((region) => region.districts.length > 0)
  }, [districtSearch])

  useEffect(() => {
    fetchOrderAndQuote()
  }, [orderId])

  const fetchOrderAndQuote = async () => {
    const supabase = createClient()

    const { data: order }: any = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single()

    if (order) {
      setOrderNumber(order.order_number || "")
      setCustomerName(order.customer_name || "")

      if (order.order_items && order.order_items.length > 0) {
        setItems(
          order.order_items.map((item: any) => ({
            order_item_id: item.id,
            product_name: item.product_name || "",
            unit: item.unit || "",
            quantity: item.quantity || 0,
            unit_price: 0,
            total: 0,
            district: "",
          }))
        )
      }
    }

    const response = await fetch(`/api/orders/${orderId}/quote`)
    const result = await response.json()
    if (result.data) {
      setExistingQuote(result.data)
      setTransport(result.data.transport?.toString() || "")
      setNotes(result.data.notes || "")
      setItems(
        result.data.quote_items.map((item: any) => ({
          order_item_id: item.order_item_id,
          product_name: item.product_name || "",
          unit: item.unit || "",
          quantity: item.quantity || 0,
          unit_price: item.unit_price || item.custom_price || 0,
          total: item.total_price || 0,
          district: item.district || "",
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

  const handleDistrictChange = (index: number, value: string) => {
    setItems((prev) => {
      const updated = [...prev]
      updated[index].district = value
      return updated
    })
  }

  const subtotalAmount = items.reduce((sum, item) => sum + item.total, 0)
  const serviceFee = subtotalAmount * 0.05
  const transportAmount = parseFloat(transport) || 0
  const totalAmount = subtotalAmount + serviceFee + transportAmount

  const handleSubmit = async () => {
    if (items.every((item) => item.unit_price <= 0)) {
      externalShowToast?.("Please enter at least one unit price", "error")
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
          district: item.district || null,
        }))

      const response = await fetch(`/api/orders/${orderId}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: quoteItems,
          notes: notes || undefined,
          transport: transportAmount,
        }),
      })

      const result = await response.json()

      if (result.error) {
        externalShowToast?.(result.error, "error")
        return
      }

      externalShowToast?.("Quote created successfully!", "success")
      window.location.href = `/admin/orders/${orderId}`
    } catch (error) {
      console.error("Error creating quote:", error)
      externalShowToast?.("Failed to create quote", "error")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `GHS ${amount.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <Link
              href={`/admin/orders/${orderId}`}
              className="inline-block mb-2 font-heading text-sm uppercase tracking-wider text-[var(--color-accent)] hover:underline"
            >
              ← Back to Order
            </Link>
            <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">
              {existingQuote ? "Quote Details" : "Create Quote"}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Order: {orderNumber} | Customer: {customerName}
            </p>
          </div>
          <div className="flex gap-3">
            {existingQuote && (
              <DropdownMenu>
                <DropdownMenuTrigger>Export</DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportQuote(existingQuote, "csv")}>
                    Download CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportQuote(existingQuote, "xlsx")}>
                    Download Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportQuote(existingQuote, "pdf")}>
                    Download PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Link href={`/admin/orders/${orderId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={loading || items.every((item) => item.unit_price <= 0)}
            >
              {loading
                ? "Saving..."
                : existingQuote
                ? "Update Quote"
                : "Create Quote"}
            </Button>
          </div>
        </div>

        <div className="bg-white border-2 border-black p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-left py-3 pr-4 w-48">
                    Product
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-3 pr-4 w-20">
                    Qty
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-3 pr-4 w-24">
                    Unit
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-left py-3 pr-4 w-72">
                    District (Optional)
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-3 pr-4 w-36">
                    Unit Price
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-right py-3 w-36">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.order_item_id} className="border-b border-[var(--color-border-light)]">
                    <td className="py-3 pr-4 text-sm font-medium">{item.product_name}</td>
                    <td className="py-3 pr-4 text-sm text-right">{item.quantity}</td>
                    <td className="py-3 pr-4 text-sm text-right">{item.unit}</td>
                    <td className="py-3 pr-4">
                      <Select
                        value={item.district}
                        onValueChange={(value) => handleDistrictChange(index, value)}
                      >
                        <SelectTrigger className="h-9 w-64">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent className="max-h-96">
                          <div className="px-2 py-2">
                            <Input
                              type="text"
                              placeholder="Search districts..."
                              value={districtSearch}
                              onChange={(e) => setDistrictSearch(e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                          {filteredDistricts.map((regionData) => (
                            <div key={regionData.region} className="py-1">
                              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase bg-muted/50 sticky top-0">
                                {regionData.region}
                              </div>
                              {regionData.districts.map((district) => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 pr-4">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price || ""}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        placeholder="0.00"
                        className="text-right h-9 w-32 ml-auto"
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
                  <td colSpan={5} className="py-4 text-right font-heading text-sm font-semibold uppercase tracking-wider">
                    Subtotal
                  </td>
                  <td className="py-4 text-right font-heading text-base font-bold text-[var(--color-accent)]">
                    {formatCurrency(subtotalAmount)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="py-2 text-right font-heading text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
                    Service Fee (5%)
                  </td>
                  <td className="py-2 text-right font-heading text-sm text-[var(--color-text-secondary)]">
                    {formatCurrency(serviceFee)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="py-2 text-right font-heading text-sm font-semibold uppercase tracking-wider">
                    Transport
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={transport || ""}
                      onChange={(e) => setTransport(e.target.value)}
                      placeholder="0.00"
                      className="text-right h-9 w-32 ml-auto"
                    />
                  </td>
                </tr>
                <tr className="border-t-2 border-black">
                  <td colSpan={5} className="py-4 text-right font-heading text-lg font-bold uppercase tracking-wider">
                    Total
                  </td>
                  <td className="py-4 text-right font-heading text-2xl font-bold text-[var(--color-accent)]">
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 max-w-md">
            <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-2">
              Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes for the customer..."
              className="min-h-[100px]"
            />
          </div>

          {existingQuote && (
            <div className="mt-4 text-xs text-[var(--color-text-muted)]">
              Quote created on{" "}
              {new Date(existingQuote.created_at).toLocaleDateString("en-GB")}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function QuotePage() {
  return <QuotePageWithToast />
}

interface QuoteItem {
  order_item_id: string
  product_name: string
  unit: string
  quantity: number
  unit_price: number
  total: number
  district: string
}