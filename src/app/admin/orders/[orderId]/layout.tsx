import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Orders",
}

export default function AdminOrdersLayout({ children }: { children: React.ReactNode }) {
  return children
}
