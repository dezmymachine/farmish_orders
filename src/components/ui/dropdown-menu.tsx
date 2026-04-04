"use client"

import * as React from "react"
import { ChevronDown, Download } from "lucide-react"

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
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownContext()

  return (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center gap-1 px-3 py-2 border-2 border-black bg-white font-heading text-xs uppercase tracking-wider hover:bg-gray-50"
    >
      <Download className="w-4 h-4" />
      {children || "Export"}
      <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
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
      className={`absolute ${alignClass} mt-1 w-36 bg-white border-2 border-black shadow-lg z-50 ${className || ""}`}
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

export function DropdownMenuItem({
  children,
  onClick,
  className,
}: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 font-medium ${className || ""}`}
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
    <div
      className={`px-4 py-2 text-xs font-heading uppercase tracking-wider text-gray-500 ${className || ""}`}
    >
      {children}
    </div>
  )
}

interface DropdownMenuSeparatorProps {}

export function DropdownMenuSeparator({}: DropdownMenuSeparatorProps) {
  return <div className="border-t border-gray-200 my-1" />
}