"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LogOut,
  Menu,
  Package,
  ReceiptText,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

interface CustomerNavProps {
  userEmail: string;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/order", label: "Place order", icon: Package },
  { href: "/dashboard/quotes", label: "Quotes", icon: ReceiptText },
];

function BrandLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/dashboard"
      aria-label="Farmish dashboard"
      className={`flex items-center ${collapsed ? "justify-center" : "justify-start"}`}
    >
      <Image
        src="/logo.png"
        alt="Farmish"
        width={250}
        height={150}
        priority
        className={collapsed ? "h-9 w-auto" : "h-12 w-auto"}
      />
    </Link>
  );
}

export function CustomerNav({ userEmail }: CustomerNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed } = useSidebar();

  const signOut = async () => {
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 bg-white text-[var(--color-farm-green)] shadow-[var(--shadow-sm)] lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </Button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,320px)] flex-col border-r border-[var(--color-field-border)] bg-[var(--color-fresh-mist)] p-5 shadow-[var(--shadow-lg)]">
            <div className="mb-8 flex items-center justify-between">
              <BrandLogo />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X size={18} />
              </Button>
            </div>
            <CustomerNavContent
              collapsed={false}
              pathname={pathname}
              userEmail={userEmail}
              onNavigate={() => setMobileOpen(false)}
              onSignOut={signOut}
            />
          </div>
        </div>
      )}

      <Sidebar>
        <SidebarRail />
        <SidebarHeader className={collapsed ? "px-4" : "px-5"}>
          <BrandLogo collapsed={collapsed} />
        </SidebarHeader>
        <CustomerNavContent
          collapsed={collapsed}
          pathname={pathname}
          userEmail={userEmail}
          onSignOut={signOut}
        />
      </Sidebar>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 border-t border-[var(--color-field-border)] bg-white px-2 py-2 shadow-[0_-8px_24px_rgba(45,80,22,0.08)] lg:hidden">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold ${
                active
                  ? "bg-[var(--color-fresh-mist)] text-[var(--color-farm-green)]"
                  : "text-[var(--color-muted-leaf)]"
              }`}
            >
              <Icon size={18} />
              {label.replace("Place ", "")}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function CustomerNavContent({
  collapsed,
  pathname,
  userEmail,
  onNavigate,
  onSignOut,
}: {
  collapsed: boolean;
  pathname: string;
  userEmail: string;
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  return (
    <>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                legacyBehavior
                passHref
              >
                <SidebarMenuButton active={active} collapsed={collapsed}>
                  <Icon size={18} />
                  <span>{label}</span>
                </SidebarMenuButton>
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        {!collapsed && (
          <div className="mb-3 rounded-2xl bg-white p-3 text-sm shadow-[var(--shadow-sm)]">
            <p className="truncate font-medium text-[var(--color-ink)]">
              {userEmail}
            </p>
          </div>
        )}
        <div className="space-y-2">
          <button
            className={`flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-farm-green)] ${collapsed ? "justify-center px-3" : ""}`}
          >
            <Settings size={18} />
            {!collapsed && "Settings"}
          </button>
          <button
            onClick={onSignOut}
            className={`flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-error-red)] ${collapsed ? "justify-center px-3" : ""}`}
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </SidebarFooter>
    </>
  );
}
