interface TelegramMessage {
  text: string;
}

export async function sendTelegramAlert(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured');
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}

export function formatGhanaTime(date: Date): string {
  return date.toLocaleString('en-GB', {
    timeZone: 'Africa/Accra',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function buildNewOrderMessage(data: {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  itemCount: number;
  address: string;
}): string {
  return `🛒 NEW ORDER RECEIVED
📋 Order: ${data.orderNumber}
👤 Customer: ${data.customerName} (${data.email})
📞 Phone: ${data.phone || 'N/A'}
📦 Items: ${data.itemCount} items
📍 Delivery: ${data.address}
⏰ ${formatGhanaTime(new Date())}`;
}

export function buildStatusUpdateMessage(data: {
  orderNumber: string;
  customerName: string;
  oldStatus: string;
  newStatus: string;
}): string {
  return `📦 ORDER STATUS UPDATE
📋 Order: ${data.orderNumber}
👤 Customer: ${data.customerName}
🔄 ${data.oldStatus} → ${data.newStatus}
⏰ ${formatGhanaTime(new Date())}`;
}
