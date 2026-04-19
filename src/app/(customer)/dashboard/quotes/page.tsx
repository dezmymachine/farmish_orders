"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportQuote } from "@/lib/export"

interface QuoteItem {
  id: string
  order_id: string
  total_amount: number
  created_at: string
  quote_items?: {
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
    district?: string
  }[]
}

export default function QuotesPage() {
  const supabase = createClient()
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [orderMap, setOrderMap] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data: orders }: any = await supabase
      .from("orders")
      .select("id, order_number")
      .eq("user_id", user.id)

    if (orders && orders.length > 0) {
      const orderIds = orders.map((o: any) => o.id)
      const map: Record<string, string> = {}
      orders.forEach((o: any) => {
        map[o.id] = o.order_number
      })
      setOrderMap(map)

      const { data: quotesData } = await supabase
        .from("quotes")
        .select("*, quote_items(*)")
        .in("order_id", orderIds)
        .order("created_at", { ascending: false })

      if (quotesData) {
        setQuotes(quotesData as QuoteItem[])
      }
    }

    setLoading(false)
  }

  const formatCurrency = (amount: number) => {
    return `GHS ${(amount || 0).toFixed(2)}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] p-6">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-block mb-4 font-heading text-sm uppercase tracking-wider text-[var(--color-accent)] hover:underline"
        >
          ← Back to Orders
        </Link>

        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-6">
          My Quotes
        </h1>

        {quotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)]">No quotes found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white border-2 border-black p-4"
              >
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <span className="font-heading text-sm uppercase tracking-wider">
                      Quote {quote.id.slice(0, 8)}
                    </span>
                    <span className="ml-3 text-sm text-[var(--color-text-muted)]">
                      Order: {orderMap[quote.order_id] || quote.order_id.slice(0, 8)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="outline" className="font-heading text-xs h-8">
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => exportQuote(quote as any, "csv")}>
                          Download CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportQuote(quote as any, "xlsx")}>
                          Download Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportQuote(quote as any, "pdf")}>
                          Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="font-mono text-lg font-bold">
                      {formatCurrency(quote.total_amount)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  Created: {formatDate(quote.created_at)}
                </p>

                {quote.quote_items && quote.quote_items.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
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
                        {quote.quote_items.map((item: any, idx: number) => (
                          <tr key={idx} className="border-b border-gray-200">
                            <td className="py-2 pr-4 text-sm">
                              {item.product_name || "Unknown"}
                            </td>
                            <td className="py-2 pr-4 text-sm text-right">
                              {item.quantity}
                            </td>
                            <td className="py-2 pr-4 text-sm">
                              {item.district || "-"}
                            </td>
                            <td className="py-2 pr-4 text-sm text-right">
                              {formatCurrency(item.unit_price || 0)}
                            </td>
                            <td className="py-2 text-sm text-right">
                              {formatCurrency(item.total_price || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}