import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/resend/client"
import { StatusUpdateEmail } from "@/lib/resend/templates/StatusUpdate"
import { sendTelegramAlert, buildStatusUpdateMessage } from "@/lib/telegram"
import { OrderStatus } from "@/types"

export async function PATCH(
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
    const { status: newStatus } = body as { status: OrderStatus }

    const validStatuses: OrderStatus[] = [
      "pending",
      "confirmed",
      "processing",
      "out_for_delivery",
      "delivered",
    ]

    if (!newStatus || !validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single()

    if (fetchError || !existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const oldStatus = existingOrder.status

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)
      .select()
      .single()

    if (updateError) {
      console.error("Status update error:", updateError)
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }

    const customerEmail = existingOrder.customer_email
    if (customerEmail) {
      const emailHtml = StatusUpdateEmail({
        customerName: existingOrder.customer_name,
        orderNumber: existingOrder.order_number,
        status: newStatus,
        items: existingOrder.order_items?.map((item: any) => ({
          product_name: item.product_name,
          quantity: item.quantity,
          unit: item.unit,
        })) || [],
      })

      await sendEmail({
        to: customerEmail,
        subject: `Order ${existingOrder.order_number} — Status Update: ${newStatus}`,
        html: emailHtml,
      })
    }

    const telegramMessage = buildStatusUpdateMessage({
      orderNumber: existingOrder.order_number,
      customerName: existingOrder.customer_name,
      oldStatus,
      newStatus,
    })
    sendTelegramAlert(telegramMessage)

    return NextResponse.json({ data: updatedOrder })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
