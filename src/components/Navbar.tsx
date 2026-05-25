"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
      })
      .catch(() => {
        setUser(null)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut().catch(() => undefined)
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-field-border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Farmish home" className="flex items-center">
          <Image src="/logo.png" alt="Farmish" width={250} height={150} className="h-10 w-auto sm:h-11" priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#how-it-works" className="text-sm font-medium text-[var(--color-muted-leaf)] hover:text-[var(--color-farm-green)]">
            How it works
          </a>
          <a href="/#produce" className="text-sm font-medium text-[var(--color-muted-leaf)] hover:text-[var(--color-farm-green)]">
            Produce
          </a>
          <a href="/#faq" className="text-sm font-medium text-[var(--color-muted-leaf)] hover:text-[var(--color-farm-green)]">
            FAQ
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-farm-green)] hover:bg-[var(--color-fresh-mist)]">
                My orders
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-[var(--color-field-border)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-fresh-mist)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-farm-green)] hover:bg-[var(--color-fresh-mist)]">
                Sign in
              </Link>
              <Link href="/order" className="rounded-full bg-[var(--color-farm-green)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-md)] hover:bg-[var(--color-deep-leaf)]">
                Place an order
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-field-border)] text-[var(--color-farm-green)] md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--color-field-border)] bg-white px-5 py-4 md:hidden">
          <div className="space-y-1">
            <a href="/#how-it-works" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-fresh-mist)]">
              How it works
            </a>
            <a href="/#produce" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-fresh-mist)]">
              Produce
            </a>
            <a href="/#faq" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-fresh-mist)]">
              FAQ
            </a>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-fresh-mist)]">
                  My orders
                </Link>
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="block w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-fresh-mist)]">
                  Sign out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-[var(--color-field-border)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-farm-green)]">
                  Sign in
                </Link>
                <Link href="/order" onClick={() => setMenuOpen(false)} className="rounded-full bg-[var(--color-farm-green)] px-4 py-3 text-center text-sm font-semibold text-white">
                  Order
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
