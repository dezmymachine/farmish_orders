interface QuoteItem {
  product_name: string
  unit: string
  quantity: number
  unit_price: number
  total_price: number
  district?: string
}

interface QuoteEmailProps {
  customerName: string
  orderNumber: string
  items: QuoteItem[]
  totalAmount: number
  serviceFee?: number
  transport?: number
  notes?: string
  quoteId?: string
}

export function QuoteEmail({
  customerName,
  orderNumber,
  items,
  totalAmount,
  serviceFee = 0,
  transport = 0,
  notes,
  quoteId,
}: QuoteEmailProps): string {
  const formatCurrency = (amount: number) => {
    return `GHS ${amount.toFixed(2)}`
  }

  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)

  const rows = items
    .map((item) => {
      return (
        "<tr>" +
        '<td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-size:13px;color:#111827">' +
        item.product_name +
        "</td>" +
        '<td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-size:13px;color:#111827;text-align:center">' +
        item.quantity +
        " " +
        item.unit +
        "</td>" +
        '<td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-size:13px;color:#111827;text-align:center">' +
        (item.district || "-") +
        "</td>" +
        '<td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-size:13px;color:#111827;text-align:right">' +
        formatCurrency(item.unit_price) +
        "</td>" +
        '<td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-size:13px;color:#111827;text-align:right;font-weight:600">' +
        formatCurrency(item.total_price) +
        "</td>" +
        "</tr>"
      )
    })
    .join("")

  let html =
    "<!DOCTYPE html>" +
    '<html lang="en">' +
    "<head>" +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    "<title>Quote for Order " +
    orderNumber +
    "</title>" +
    "</head>" +
    '<body style="margin:0;padding:0;background-color:#F7F5F0;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F5F0">' +
    "<tr>" +
    '<td align="center" style="padding:40px 16px">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:650px;background:#FFFFFF">' +
    "<tr>" +
    '<td style="padding:32px 32px 24px;text-align:center">' +
    '<p style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.15em;color:#2D5016;text-transform:uppercase">Farmish</p>' +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td style="padding:0 32px 32px">' +
    '<p style="margin:0 0 8px;font-size:20px;font-weight:600;color:#111827">Quote for Your Order</p>' +
    '<p style="margin:0 0 16px;font-size:14px;color:#6B7280">Hi ' +
    customerName +
    ",</p>" +
    '<p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.6">' +
    "Thank you for your order. Please find below the quote for order <strong>" +
    orderNumber +
    "</strong>." +
    "</p>" +
    '<p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.1em;color:#6B7280;text-transform:uppercase">Order Items</p>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">' +
    "<tr>" +
    '<th style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#6B7280;text-transform:uppercase;text-align:left;border-bottom:2px solid #E5E7EB">Product</th>' +
    '<th style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#6B7280;text-transform:uppercase;text-align:center;border-bottom:2px solid #E5E7EB;width:70px">Qty</th>' +
    '<th style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#6B7280;text-transform:uppercase;text-align:center;border-bottom:2px solid #E5E7EB;width:120px">District</th>' +
    '<th style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#6B7280;text-transform:uppercase;text-align:right;border-bottom:2px solid #E5E7EB;width:80px">Unit Price</th>' +
    '<th style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#6B7280;text-transform:uppercase;text-align:right;border-bottom:2px solid #E5E7EB;width:90px">Total</th>' +
    "</tr>" +
    rows +
    "<tr>" +
    '<td colspan="4" style="padding:12px 0;font-size:13px;color:#6B7280;text-align:right">Subtotal</td>' +
    '<td style="padding:12px 0;font-size:13px;color:#111827;text-align:right">' +
    formatCurrency(subtotal) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td colspan="4" style="padding:8px 0;font-size:13px;color:#6B7280;text-align:right">Service Fee (5%)</td>' +
    '<td style="padding:8px 0;font-size:13px;color:#111827;text-align:right">' +
    formatCurrency(serviceFee) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td colspan="4" style="padding:8px 0;font-size:13px;color:#6B7280;text-align:right">Transport</td>' +
    '<td style="padding:8px 0;font-size:13px;color:#111827;text-align:right">' +
    formatCurrency(transport) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td colspan="4" style="padding:16px 0;font-size:14px;font-weight:600;color:#111827;text-align:right">Total Amount</td>' +
    '<td style="padding:16px 0;font-size:16px;font-weight:700;color:#2D5016;text-align:right">' +
    formatCurrency(totalAmount) +
    "</td>" +
    "</tr>" +
    "</table>"

  if (notes) {
    html +=
      '<div style="background:#F7F5F0;padding:16px;margin-bottom:24px;border-left:4px solid #2D5016">' +
      '<p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.1em;color:#6B7280;text-transform:uppercase">Notes</p>' +
      '<p style="margin:0;font-size:14px;color:#374151;line-height:1.6">' +
      notes +
      "</p>" +
      "</div>"
  }

  html +=
    '<p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6">' +
    "If you have any questions about this quote, please contact us." +
    "</p>" +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E5E7EB;margin-top:24px;padding-top:20px">' +
    "<tr>" +
    "<td>" +
    '<p style="margin:0 0 4px;font-size:14px;font-family:\'SF Mono\',Monaco,Consolas,monospace;color:#111827">' +
    orderNumber +
    "</p>" +
    '<p style="margin:0;font-size:12px;color:#9CA3AF">View your order at <a href="' +
    (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") +
    '/dashboard" style="color:#2D5016;text-decoration:none">your dashboard</a></p>' +
    "</td>" +
    "</tr>" +
    "</table>" +
    "</td>" +
    "</tr>" +
    "</table>" +
    "</td>" +
    "</tr>" +
    "</table>" +
    "</body>" +
    "</html>"

  return html
}