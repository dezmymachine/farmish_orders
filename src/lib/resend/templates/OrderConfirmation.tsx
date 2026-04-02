interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  items: Array<{
    product_name: string;
    quantity: number;
    unit: string;
  }>;
  deliveryAddress: string;
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  items,
  deliveryAddress,
}: OrderConfirmationEmailProps) => {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-size:14px;color:#111827">${item.product_name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-size:14px;color:#111827;text-align:center">${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #E5E7EB;font-size:14px;color:#6B7280;text-align:right">${item.unit}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Order ${orderNumber}</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F5F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F5F0">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF">
          <tr>
            <td style="padding:32px 32px 24px;text-align:center">
              <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.15em;color:#2D5016;text-transform:uppercase">Farmish</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px">
              <p style="margin:0 0 8px;font-size:20px;font-weight:600;color:#111827">Order received</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6B7280">Hi ${customerName}, we've received your order and will review it shortly.</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border-left:3px solid #2D5016;margin-bottom:24px">
                <tr>
                  <td style="padding:12px 16px">
                    <p style="margin:0;font-size:13px;color:#2D5016;font-weight:500">We'll send you a quote within 24 hours.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.1em;color:#6B7280;text-transform:uppercase">Items</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <th style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#6B7280;text-transform:uppercase;text-align:left;border-bottom:2px solid #E5E7EB">Product</th>
                  <th style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#6B7280;text-transform:uppercase;text-align:center;border-bottom:2px solid #E5E7EB;width:60px">Qty</th>
                  <th style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#6B7280;text-transform:uppercase;text-align:right;border-bottom:2px solid #E5E7EB;width:80px">Unit</th>
                </tr>
                ${rows}
              </table>

              <p style="margin:24px 0 8px;font-size:11px;font-weight:600;letter-spacing:0.1em;color:#6B7280;text-transform:uppercase">Delivery Address</p>
              <p style="margin:0 0 24px;font-size:14px;color:#111827;line-height:1.5">${deliveryAddress}</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E5E7EB;padding-top:20px">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:14px;font-family:'SF Mono',Monaco,Consolas,monospace;color:#111827">${orderNumber}</p>
                    <p style="margin:0;font-size:12px;color:#9CA3AF">Track your order at <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#2D5016;text-decoration:none">your dashboard</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
