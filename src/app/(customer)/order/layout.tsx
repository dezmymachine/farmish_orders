import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Place Order",
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return children
}
