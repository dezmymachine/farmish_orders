"use client"

import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Order } from "@/types"

export type ExportFormat = "csv" | "xlsx" | "pdf"

export function exportOrders(orders: Order[], format: ExportFormat) {
  const summaryData = orders.map((order) => ({
    "Order No.": order.order_number,
    Date: new Date(order.created_at).toLocaleDateString("en-GB"),
    Items: order.order_items?.length || 0,
    Status: order.status.replace(/_/g, " "),
    "Delivery Address": order.delivery_address || "",
  }))

  const fileName = `orders_${new Date().toISOString().split("T")[0]}`

  switch (format) {
    case "csv":
      exportToCSV(summaryData, fileName)
      break
    case "xlsx":
      exportToXLSX(summaryData, fileName)
      break
    case "pdf":
      exportToPDF(orders, fileName)
      break
  }
}

function exportToCSV(data: Record<string, unknown>[], fileName: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header]
        const escaped = String(value).replace(/"/g, '""')
        return `"${escaped}"`
      }).join(",")
    ),
  ]

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
  downloadBlob(blob, `${fileName}.csv`)
}

function exportToXLSX(data: Record<string, unknown>[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders")

  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...data.map((row) => String(row[key] || "").length)),
  }))
  worksheet["!cols"] = colWidths

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  downloadBlob(blob, `${fileName}.xlsx`)
}

function exportToPDF(orders: Order[], fileName: string) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text("Order Summary", 14, 22)

  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, 14, 30)

  const tableData = orders.map((order) => [
    order.order_number,
    new Date(order.created_at).toLocaleDateString("en-GB"),
    String(order.order_items?.length || 0),
    order.status.replace(/_/g, " "),
    order.delivery_address || "-",
  ])

  autoTable(doc, {
    startY: 35,
    head: [["Order No.", "Date", "Items", "Status", "Address"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [45, 80, 22],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
    },
  })

  doc.save(`${fileName}.pdf`)
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportQuote(quote: any, format: ExportFormat) {
  const fileName = `quote_${quote.id.slice(0, 8)}`

  switch (format) {
    case "csv":
      exportQuoteToCSV(quote, fileName)
      break
    case "xlsx":
      exportQuoteToXLSX(quote, fileName)
      break
    case "pdf":
      exportQuoteToPDF(quote, fileName)
      break
  }
}

function exportQuoteToCSV(quote: any, fileName: string) {
  const rows: any[][] = [
    ["Field", "Value"],
    ["Quote ID", quote.id.slice(0, 8)],
    ["Date", new Date(quote.created_at).toLocaleDateString("en-GB")],
    [],
    ["Items"],
    ["Product", "Quantity", "Unit", "District", "Unit Price", "Total"],
  ]

  for (const item of quote.quote_items || []) {
    rows.push([
      item.product_name || "Unknown",
      item.quantity,
      item.unit || "",
      item.district || "",
      `GHS ${(item.unit_price || 0).toFixed(2)}`,
      `GHS ${(item.total_price || 0).toFixed(2)}`,
    ])
  }

  const subtotal = (quote.quote_items || []).reduce(
    (sum: number, item: any) => sum + (item.total_price || 0),
    0
  )
  const serviceFee = quote.service_fee || subtotal * 0.05
  const transport = quote.transport || 0

  rows.push(
    [],
    [],
    ["Subtotal", `GHS ${subtotal.toFixed(2)}`],
    ["Service Fee (5%)", `GHS ${serviceFee.toFixed(2)}`],
    ["Transport", `GHS ${transport.toFixed(2)}`],
    ["TOTAL", `GHS ${(quote.total_amount || 0).toFixed(2)}`]
  )

  const csvContent = rows.map((row) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\n")
  const blob = new Blob([csvContent], { type: "text/csv" })
  downloadBlob(blob, `${fileName}.csv`)
}

function exportQuoteToXLSX(quote: any, fileName: string) {
  const itemsData = (quote.quote_items || []).map((item: any) => ({
    Product: item.product_name || "Unknown",
    Quantity: item.quantity,
    Unit: item.unit || "",
    District: item.district || "",
    Unit_Price: item.unit_price || 0,
    Total_Price: item.total_price || 0,
  }))

  const summaryData = [
    { Field: "Quote ID", Value: quote.id.slice(0, 8) },
    { Field: "Date", Value: new Date(quote.created_at).toLocaleDateString("en-GB") },
    { Field: "", Value: "" },
    {
      Field: "Subtotal",
      Value: quote.quote_items?.reduce((s: number, i: any) => s + (i.total_price || 0), 0) || 0,
    },
    { Field: "Service Fee (5%)", Value: quote.service_fee || 0 },
    { Field: "Transport", Value: quote.transport || 0 },
    { Field: "TOTAL", Value: quote.total_amount || 0 },
  ]

  const worksheet1 = XLSX.utils.json_to_sheet(itemsData)
  const worksheet2 = XLSX.utils.json_to_sheet(summaryData)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet1, "Quote Items")
  XLSX.utils.book_append_sheet(workbook, worksheet2, "Summary")

  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

function exportQuoteToPDF(quote: any, fileName: string) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text("QUOTE", 14, 22)

  doc.setFontSize(10)
  doc.text(`Quote ID: ${quote.id.slice(0, 8)}`, 14, 32)
  doc.text(
    `Date: ${new Date(quote.created_at).toLocaleDateString("en-GB")}`,
    14,
    38
  )

  const tableData = (quote.quote_items || []).map((item: any) => [
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

  const subtotal = (quote.quote_items || []).reduce(
    (sum: number, item: any) => sum + (item.total_price || 0),
    0
  )
  const serviceFee = quote.service_fee || subtotal * 0.05
  const transport = quote.transport || 0

  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.text(`Subtotal: GHS ${subtotal.toFixed(2)}`, 140, finalY, { align: "right" })
  doc.text(
    `Service Fee (5%): GHS ${serviceFee.toFixed(2)}`,
    140,
    finalY + 6,
    { align: "right" }
  )
  doc.text(`Transport: GHS ${transport.toFixed(2)}`, 140, finalY + 12, {
    align: "right",
  })
  doc.setFontSize(12)
  doc.text(`Total: GHS ${(quote.total_amount || 0).toFixed(2)}`, 140, finalY + 20, {
    align: "right",
  })

  doc.save(`${fileName}.pdf`)
}

export function exportSingleOrder(order: Order, format: ExportFormat) {
  const orderItems = order.order_items || []
  const fileName = `order_${order.order_number}`

  switch (format) {
    case "csv":
      exportSingleOrderToCSV(order, orderItems, fileName)
      break
    case "xlsx":
      exportSingleOrderToXLSX(order, orderItems, fileName)
      break
    case "pdf":
      exportSingleOrderToPDF(order, orderItems, fileName)
      break
  }
}

function exportSingleOrderToCSV(
  order: Order,
  items: Order["order_items"],
  fileName: string
) {
  const rows = [
    ["Field", "Value"],
    ["Order Number", order.order_number],
    ["Date", new Date(order.created_at).toLocaleDateString("en-GB")],
    ["Status", order.status.replace(/_/g, " ")],
    ["Customer Name", order.customer_name],
    ["Customer Email", order.customer_email],
    ["Customer Phone", order.customer_phone || "N/A"],
    ["Delivery Address", order.delivery_address || "N/A"],
    ["Delivery Notes", order.delivery_notes || "N/A"],
    [],
    ["Product", "Quantity", "Unit"],
    ...items.map((item) => [item.product_name, String(item.quantity), item.unit]),
  ]

  const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csvContent], { type: "text/csv" })
  downloadBlob(blob, `${fileName}.csv`)
}

function exportSingleOrderToXLSX(
  order: Order,
  items: Order["order_items"],
  fileName: string
) {
  const orderInfo = [
    ["Field", "Value"],
    ["Order Number", order.order_number],
    ["Date", new Date(order.created_at).toLocaleDateString("en-GB")],
    ["Status", order.status.replace(/_/g, " ")],
    ["Customer Name", order.customer_name],
    ["Customer Email", order.customer_email],
    ["Customer Phone", order.customer_phone || "N/A"],
    ["Delivery Address", order.delivery_address || "N/A"],
    ["Delivery Notes", order.delivery_notes || "N/A"],
  ]

  const itemsData = [
    ["Product", "Quantity", "Unit"],
    ...items.map((item) => [item.product_name, item.quantity, item.unit]),
  ]

  const wb = XLSX.utils.book_new()
  const ws1 = XLSX.utils.aoa_to_sheet(orderInfo)
  const ws2 = XLSX.utils.aoa_to_sheet(itemsData)

  XLSX.utils.book_append_sheet(wb, ws1, "Order Info")
  XLSX.utils.book_append_sheet(wb, ws2, "Items")

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  downloadBlob(blob, `${fileName}.xlsx`)
}

function exportSingleOrderToPDF(
  order: Order,
  items: Order["order_items"],
  fileName: string
) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text(`Order ${order.order_number}`, 14, 22)

  doc.setFontSize(10)
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString("en-GB")}`, 14, 30)
  doc.text(`Status: ${order.status.replace(/_/g, " ")}`, 14, 36)

  doc.setFontSize(12)
  doc.text("Customer Information", 14, 48)
  doc.setFontSize(10)
  doc.text(`Name: ${order.customer_name}`, 14, 56)
  doc.text(`Email: ${order.customer_email}`, 14, 62)
  doc.text(`Phone: ${order.customer_phone || "N/A"}`, 14, 68)
  doc.text(`Address: ${order.delivery_address || "N/A"}`, 14, 74)
  if (order.delivery_notes) {
    doc.text(`Notes: ${order.delivery_notes}`, 14, 80)
  }

  const tableData = items.map((item) => [
    item.product_name,
    String(item.quantity),
    item.unit,
  ])

  autoTable(doc, {
    startY: 90,
    head: [["Product", "Quantity", "Unit"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [45, 80, 22],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
    },
  })

  doc.save(`${fileName}.pdf`)
}