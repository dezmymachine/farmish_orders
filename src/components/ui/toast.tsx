"use client"

import { useEffect, useState } from "react"

interface ToastProps {
  message: string
  type?: "success" | "error"
  onClose: () => void
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-2xl px-4 py-3 text-sm font-semibold shadow-[var(--shadow-lg)] animate-in slide-in-from-bottom ${
        type === "success"
          ? "bg-[var(--color-success-green)] text-white"
          : "bg-[var(--color-error-red)] text-white"
      }`}
    >
      {message}
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  return { toast, showToast, hideToast }
}

export function ToastContainer({
  toast,
  onClose,
}: {
  toast: { message: string; type: "success" | "error" } | null
  onClose: () => void
}) {
  if (!toast) return null
  return <Toast message={toast.message} type={toast.type} onClose={onClose} />
}