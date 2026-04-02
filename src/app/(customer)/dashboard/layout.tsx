import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Orders",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
