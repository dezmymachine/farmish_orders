import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/resend/client"
import { QuoteEmail } from "@/lib/resend/templates/Quote"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function generateQuotePDF(
  items: any[],
  totalAmount: number,
  serviceFee: number,
  transport: number,
  orderNumber: string
): Buffer {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text("QUOTE", 14, 22)

  doc.setFontSize(10)
  doc.text(`Order: ${orderNumber}`, 14, 32)
  doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 14, 38)

  const tableData = items.map((item) => [
    item.product_name || "Unknown",
    item.quantity.toString(),
    item.unit || "-",
    item.district || "-",
    `GHS ${(item.unit_price || 0).toFixed(2)}`,
    `GHS ${(item.total_price || 0).toFixed(2)}`,
  ])

  autoTable(doc, {
    startY: 45,
    head: [["Product", "Qty", "Unit", "District", "Unit Price", "Total"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [45, 86, 22] },
    styles: { fontSize: 8 },
  })

  const subtotal = items.reduce((sum: number, item: any) => sum + (item.total_price || 0), 0)
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.text(`Subtotal: GHS ${subtotal.toFixed(2)}`, 140, finalY, { align: "right" })
  doc.text(`Service Fee (5%): GHS ${serviceFee.toFixed(2)}`, 140, finalY + 6, { align: "right" })
  doc.text(`Transport: GHS ${transport.toFixed(2)}`, 140, finalY + 12, { align: "right" })
  doc.setFontSize(12)
  doc.text(`Total: GHS ${totalAmount.toFixed(2)}`, 140, finalY + 20, { align: "right" })

  return Buffer.from(doc.output("arraybuffer")) as unknown as Buffer
}

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
    const { items, notes, transport } = body as {
      items: Array<{
        order_item_id: string
        product_name: string
        unit: string
        quantity: number
        unit_price: number
        district?: string | null
      }>
      notes?: string
      transport?: number
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

    const subtotalAmount = quoteItems.reduce((sum, item) => sum + item.total_price, 0)
    const serviceFee = subtotalAmount * 0.05
    const transportAmount = transport || 0
    const totalAmount = subtotalAmount + serviceFee + transportAmount

    const quoteInsertData: any = {
      order_id: orderId,
      created_by: user.id,
      total_amount: totalAmount,
      notes: notes || null,
    }

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .insert(quoteInsertData)
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
      total_price: item.unit_price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from("quote_items")
      .insert(quoteItemsWithIds)

    if (itemsError) {
      console.error("Quote items error:", itemsError)
      console.error("Insert data:", JSON.stringify(quoteItemsWithIds))
      return NextResponse.json(
        { error: `Failed to create quote items: ${itemsError.message}` },
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
        serviceFee,
        transport: transportAmount,
        notes: notes || undefined,
        quoteId: quote.id,
      })

      const pdfBuffer = generateQuotePDF(quoteItems, totalAmount, serviceFee, transportAmount, existingOrder.order_number)

      await sendEmail({
        to: customerEmail,
        subject: `Quote for Order ${existingOrder.order_number}`,
        html: emailHtml,
        attachments: [
          {
            filename: `quote_${existingOrder.order_number}.pdf`,
            content: pdfBuffer.toString("base64"),
          },
        ],
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