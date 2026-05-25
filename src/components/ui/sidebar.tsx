"use client"

import * as React from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SidebarContext = React.createContext<{
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}

function SidebarProvider({
  defaultCollapsed = false,
  children,
}: {
  defaultCollapsed?: boolean
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
  const { collapsed } = useSidebar()

  return (
    <aside
      data-slot="sidebar"
      data-collapsed={collapsed}
      className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col lg:border-r lg:border-sidebar-border lg:bg-sidebar lg:transition-[width] lg:duration-200",
        collapsed ? "lg:w-24" : "lg:w-72",
        className
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("p-5", className)} {...props} />
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-content" className={cn("flex-1 px-4", className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("border-t border-sidebar-border p-4", className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" className={cn("space-y-2", className)} {...props} />
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="sidebar-menu" className={cn("space-y-2", className)} {...props} />
}

function SidebarMenuButton({
  className,
  active,
  collapsed,
  ...props
}: React.ComponentProps<"a"> & { active?: boolean; collapsed?: boolean }) {
  return (
    <a
      data-slot="sidebar-menu-button"
      data-active={active}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:ring-4 focus-visible:ring-sidebar-ring/15",
        active
          ? "bg-white text-sidebar-primary shadow-[var(--shadow-sm)]"
          : "text-[var(--color-text-secondary)] hover:bg-white/70 hover:text-sidebar-primary",
        collapsed && "justify-center px-3 [&>span]:sr-only",
        className
      )}
      {...props}
    />
  )
}

function SidebarRail() {
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={() => setCollapsed((value) => !value)}
      className="absolute -right-4 top-6 hidden rounded-full border border-sidebar-border bg-white text-sidebar-primary shadow-[var(--shadow-sm)] hover:bg-white lg:inline-flex"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
    </Button>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  const { collapsed } = useSidebar()

  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "min-h-screen pb-24 transition-[margin] duration-200 lg:pb-0",
        collapsed ? "lg:ml-24" : "lg:ml-72",
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  useSidebar,
}
