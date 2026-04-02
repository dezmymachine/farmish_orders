import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CustomerNav } from "@/components/CustomerNav"

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex">
      <CustomerNav userEmail={user.email || ""} />
      <main className="flex-1 lg:ml-64">
        {children}
      </main>
    </div>
  )
}
