import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CustomerNav } from "@/components/CustomerNav"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

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
    <SidebarProvider>
      <div className="min-h-screen bg-[var(--color-white-canvas)]">
        <CustomerNav userEmail={user.email || ""} />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  )
}
