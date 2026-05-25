"use client"

import * as React from "react"
import { ChevronDown, Download } from "lucide-react"

import { cn } from "@/lib/utils"

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null)

function useDropdownContext() {
  const context = React.useContext(DropdownContext)
  if (!context) {
    throw new Error("Dropdown components must be used within DropdownMenu")
  }
  return context
}

interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children?: React.ReactNode
  className?: string
}

export function DropdownMenuTrigger({ children, className }: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownContext()

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-field-border)] bg-white px-4 text-sm font-semibold text-[var(--color-farm-green)] shadow-[var(--shadow-sm)] transition-all hover:bg-[var(--color-fresh-mist)] focus-visible:ring-4 focus-visible:ring-ring/15",
        className
      )}
    >
      <Download className="h-4 w-4" />
      {children || "Export"}
      <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
    </button>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: "start" | "end" | "center"
}

export function DropdownMenuContent({
  children,
  className,
  align = "end",
}: DropdownMenuContentProps) {
  const { open, setOpen } = useDropdownContext()

  if (!open) return null

  const alignClass =
    align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0"

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-44 overflow-hidden rounded-2xl border border-[var(--color-field-border)] bg-white p-1.5 text-sm shadow-[var(--shadow-lg)]",
        alignClass,
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ onClick?: () => void }>, {
              onClick: () => {
                const originalOnClick = (child.props as { onClick?: () => void }).onClick
                if (originalOnClick) originalOnClick()
                setOpen(false)
              },
            })
          : child
      )}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function DropdownMenuItem({ children, onClick, className }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-fresh-mist)] hover:text-[var(--color-farm-green)] focus-visible:bg-[var(--color-fresh-mist)]",
        className
      )}
    >
      {children}
    </button>
  )
}

interface DropdownMenuLabelProps {
  children: React.ReactNode
  className?: string
}

export function DropdownMenuLabel({ children, className }: DropdownMenuLabelProps) {
  return (
    <div className={cn("px-3 py-2 text-xs font-bold uppercase tracking-tight text-[var(--color-muted-leaf)]", className)}>
      {children}
    </div>
  )
}

interface DropdownMenuSeparatorProps {}

export function DropdownMenuSeparator({}: DropdownMenuSeparatorProps) {
  return <div className="my-1 h-px bg-[var(--color-field-border)]" />
}
