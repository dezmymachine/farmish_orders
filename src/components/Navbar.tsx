"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import type { User } from "@supabase/supabase-js"

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F] h-[48px] md:h-[56px]">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
          <Link href="/">
            <Image src="/logo.png" alt="Farmish" width={40} height={40} className="shrink-0 w-8 h-8 md:w-10 md:h-10" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="font-heading font-semibold uppercase tracking-wider text-[13px] text-white hover:text-[#EBF0E4] transition-colors duration-150"
                >
                  MY ORDERS
                </Link>
                <button
                  onClick={handleSignOut}
                  className="font-heading font-semibold uppercase tracking-wider text-[13px] text-white border border-white bg-transparent px-5 py-1.5 transition-colors duration-150 hover:bg-white hover:text-[#0F0F0F] rounded-none"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="font-heading font-semibold uppercase tracking-wider text-[13px] text-white border border-white bg-transparent px-5 py-1.5 transition-colors duration-150 hover:bg-white hover:text-[#0F0F0F] rounded-none"
              >
                SIGN IN
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8"
          >
            <span className="block w-5 h-0.5 bg-white mb-1"></span>
            <span className="block w-5 h-0.5 bg-white mb-1"></span>
            <span className="block w-5 h-0.5 bg-white"></span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed top-[48px] left-0 right-0 z-40 bg-[#0F0F0F] md:hidden">
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 font-heading font-semibold uppercase tracking-wider text-[13px] text-white border-b border-[#2A2A2A] hover:text-[#EBF0E4] transition-colors duration-150"
              >
                MY ORDERS
              </Link>
              <button
                onClick={() => {
                  handleSignOut()
                  setMenuOpen(false)
                }}
                className="block w-full text-left px-6 py-3 font-heading font-semibold uppercase tracking-wider text-[13px] text-white border-b border-[#2A2A2A] hover:text-[#EBF0E4] transition-colors duration-150"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 font-heading font-semibold uppercase tracking-wider text-[13px] text-white border-b border-[#2A2A2A] hover:text-[#EBF0E4] transition-colors duration-150"
            >
              SIGN IN
            </Link>
          )}
        </div>
      )}
    </>
  )
}
