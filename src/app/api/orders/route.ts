import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/resend/client"
import { OrderConfirmationEmail } from "@/lib/resend/templates/OrderConfirmation"
import { sendTelegramAlert, buildNewOrderMessage } from "@/lib/telegram"

interface OrderItem {
  product_id: string | null
  product_name: string
  unit: string
  quantity: number
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    return NextResponse.json({ data: orders })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { order_id, items, delivery_address, delivery_notes } = body as {
      order_id: string
      items: OrderItem[]
      delivery_address: string
      delivery_notes?: string
    }

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("status")
      .eq("id", order_id)
      .eq("user_id", user.id)
      .single()

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (existingOrder.status !== "pending") {
      return NextResponse.json({ error: "Can only edit pending orders" }, { status: 400 })
    }

    const { error: orderError } = await supabase
      .from("orders")
      .update({
        delivery_address,
        delivery_notes: delivery_notes || null,
      })
      .eq("id", order_id)

    if (orderError) {
      console.error("Order update error:", orderError)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    const { error: deleteItemsError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", order_id)

    if (deleteItemsError) {
      console.error("Delete items error:", deleteItemsError)
      return NextResponse.json({ error: "Failed to update order items" }, { status: 500 })
    }

    const orderItems = items.map((item) => ({
      order_id,
      product_id: item.product_id,
      product_name: item.product_name,
      unit: item.unit,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Order items insert error:", itemsError)
      return NextResponse.json({ error: "Failed to update order items" }, { status: 500 })
    }

    return NextResponse.json({ data: { order_id } })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("order_id")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (existingOrder.status !== "pending") {
      return NextResponse.json({ error: "Can only cancel pending orders" }, { status: 400 })
    }

    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId)

    if (deleteError) {
      console.error("Delete order error:", deleteError)
      return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
    }

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, delivery_address, delivery_notes } = body as {
      items: OrderItem[]
      delivery_address: string
      delivery_notes?: string
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "At least one item is required" }, { status: 400 })
    }

    if (!delivery_address || !delivery_address.trim()) {
      return NextResponse.json({ error: "Delivery address is required" }, { status: 400 })
    }

    let { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single()

    if (!profile) {
      await supabase
        .from("user_profiles")
        .insert({ id: user.id })
    }

    profile = profile || { full_name: user.email?.split("@")[0] || "Customer", phone: null }

    const orderNumber = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        customer_name: profile?.full_name || user.email?.split("@")[0] || "Customer",
        customer_email: user.email || "",
        customer_phone: profile?.phone || null,
        delivery_address,
        delivery_notes: delivery_notes || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order insert error:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      unit: item.unit,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Order items insert error:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    const customerName = profile?.full_name || "Customer"
    const customerEmail = user.email || ""

    if (customerEmail) {
      const emailHtml = OrderConfirmationEmail({
        customerName,
        orderNumber,
        items: items.map((i) => ({
          product_name: i.product_name,
          quantity: i.quantity,
          unit: i.unit,
        })),
        deliveryAddress: delivery_address,
      })

      await sendEmail({
        to: customerEmail,
        subject: `Order Received – ${orderNumber}`,
        html: emailHtml,
      })
    }

    const telegramMessage = buildNewOrderMessage({
      orderNumber,
      customerName,
      email: customerEmail,
      phone: profile?.phone || "N/A",
      itemCount: items.length,
      address: delivery_address,
    })
    sendTelegramAlert(telegramMessage)

    return NextResponse.json({
      data: {
        order_number: orderNumber,
        id: order.id,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
