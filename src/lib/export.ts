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