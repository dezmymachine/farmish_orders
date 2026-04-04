import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/resend/client"
import { QuoteEmail } from "@/lib/resend/templates/Quote"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { items, notes } = body as {
      items: Array<{
        order_item_id: string
        product_name: string
        unit: string
        quantity: number
        unit_price: number
      }>
      notes?: string
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "At least one quote item is required" },
        { status: 400 }
      )
    }

    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single()

    if (fetchError || !existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const quoteItems = items.map((item) => ({
      ...item,
      total_price: item.quantity * item.unit_price,
    }))

    const totalAmount = quoteItems.reduce((sum, item) => sum + item.total_price, 0)

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        order_id: orderId,
        created_by: user.id,
        total_amount: totalAmount,
        notes: notes || null,
      })
      .select()
      .single()

    if (quoteError) {
      console.error("Quote creation error:", quoteError)
      return NextResponse.json(
        { error: "Failed to create quote" },
        { status: 500 }
      )
    }

    const quoteItemsWithIds = quoteItems.map((item) => ({
      quote_id: quote.id,
      order_item_id: item.order_item_id,
      product_name: item.product_name,
      unit: item.unit,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }))

    const { error: itemsError } = await supabase
      .from("quote_items")
      .insert(quoteItemsWithIds)

    if (itemsError) {
      console.error("Quote items error:", itemsError)
      return NextResponse.json(
        { error: "Failed to create quote items" },
        { status: 500 }
      )
    }

    const customerEmail = existingOrder.customer_email
    if (customerEmail) {
      const emailHtml = QuoteEmail({
        customerName: existingOrder.customer_name,
        orderNumber: existingOrder.order_number,
        items: quoteItems,
        totalAmount,
        notes: notes || undefined,
      })

      await sendEmail({
        to: customerEmail,
        subject: `Quote for Order ${existingOrder.order_number}`,
        html: emailHtml,
      })
    }

    return NextResponse.json({ data: quote })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const supabase = await createClient()

    const { data: quote, error } = await supabase
      .from("quotes")
      .select("*, quote_items(*)")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 })
    }

    return NextResponse.json({ data: quote || null })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}