"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

interface CustomerNavProps {
  userEmail: string
}

export function CustomerNav({ userEmail }: CustomerNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-black text-white"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col
          transform transition-transform duration-200
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link href="/order" className="font-heading text-2xl font-bold tracking-wider">
            FARM ORDERS
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4">
          <Link
            href="/order"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-sm font-heading uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Place Order
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-sm font-heading uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            My Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 mb-3 truncate">{userEmail}</p>
          <form action={async () => {
            const supabase = (await import("@/lib/supabase/client")).createClient()
            await supabase.auth.signOut()
            window.location.href = "/login"
          }}>
            <button className="w-full text-left text-sm font-heading uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
