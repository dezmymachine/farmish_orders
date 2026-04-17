"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { OrderItem } from "@/types"
import { Button } from "@/components/ui/button"

interface QuoteModalProps {
  orderId: string
  orderItems: OrderItem[]
  customerEmail: string
  onSuccess?: () => void
}

export function QuoteModal({
  orderId,
  orderItems,
  customerEmail,
  onSuccess,
}: QuoteModalProps) {
  const supabase = createClient()
  const [existingQuote, setExistingQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkExistingQuote()
  }, [orderId])

  const checkExistingQuote = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/quote`)
      const result = await response.json()
      if (result.data) {
        setExistingQuote(result.data)
      }
    } catch (error) {
      console.error("Error checking quote:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = () => {
    window.location.href = `/admin/orders/${orderId}/quote?email=${encodeURIComponent(customerEmail)}`
  }

  if (loading) {
    return (
      <Button
        className="font-heading uppercase tracking-wider text-xs"
        disabled
      >
        Loading...
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      className="font-heading uppercase tracking-wider text-xs"
    >
      {existingQuote ? "View/Edit Quote" : "Create Quote"}
    </Button>
  )
}