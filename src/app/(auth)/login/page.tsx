"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error } = await supabase.auth
      .signInWithPassword({ email, password })
      .catch(() => ({
        error: new Error("Unable to reach the authentication service. Please try again shortly."),
      }))

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/order")
    }
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <section className="hidden overflow-hidden bg-[var(--color-farm-green)] lg:block">
        <div className="relative h-full min-h-screen">
          <Image src="/group_farmers.jpg" alt="Ghanaian farmers preparing fresh produce" fill priority className="object-cover opacity-80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-deep-leaf)] via-[var(--color-farm-green)]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-12 text-white">
            <div className="mb-6 flex items-center">
              <Image src="/logo.png" alt="Farmish" width={250} height={150} className="h-12 w-auto brightness-0 invert" />
            </div>
            <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">Empowering Ghanaian produce sourcing.</h1>
            <p className="mt-4 max-w-md text-white/80">Manage requests, quotes and deliveries with one reliable account.</p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:justify-start">
            <Image src="/logo.png" alt="Farmish" width={250} height={150} className="h-11 w-auto" />
          </div>

          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-deep-leaf)]">Welcome back</h1>
            <p className="mt-3 text-[var(--color-muted-leaf)]">Sign in to manage your sourcing requests.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-tight text-[var(--color-text-secondary)]">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-leaf)]" size={18} />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="h-12 bg-[var(--color-fresh-mist)] pl-11" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-tight text-[var(--color-text-secondary)]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-leaf)]" size={18} />
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="h-12 bg-[var(--color-fresh-mist)] pl-11 pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--color-muted-leaf)] hover:text-[var(--color-farm-green)]" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-2xl bg-[var(--color-danger-light)] px-4 py-3 text-sm text-[var(--color-error-red)]">{error}</p>}

            <Button type="submit" disabled={loading} className="h-12 w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <footer className="mt-8 border-t border-[var(--color-field-border)] pt-6 text-center text-sm text-[var(--color-muted-leaf)]">
            Don&apos;t have an account? <Link href="/signup" className="font-semibold text-[var(--color-farm-green)] hover:underline">Create one</Link>
          </footer>
        </div>
      </section>
    </main>
  )
}
