"use client"

import { useState } from "react"
import { CartItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PRESET_UNITS = [
  "Sack",
  "Sack (Small)",
  "Sack (Big)",
  "Basket",
  "Box",
  "Box (Big)",
  "Olonka",
  "Bundles (10)",
  "Gallon (Big)",
  "Bunch",
  "Pcs",
  "Kg",
  "Liter",
  "Crate",
  "Bag",
  "Ton",
]

interface CustomItemFormProps {
  onAdd: (item: CartItem) => void
}

export function CustomItemForm({ onAdd }: CustomItemFormProps) {
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unitMode, setUnitMode] = useState<"preset" | "custom">("preset")
  const [selectedUnit, setSelectedUnit] = useState("")
  const [customUnit, setCustomUnit] = useState("")

  const handleAdd = () => {
    if (!itemName.trim()) return
    if (!quantity || parseFloat(quantity) <= 0) return
    const unit = unitMode === "preset" ? selectedUnit : customUnit
    if (!unit) return

    onAdd({
      product: null,
      quantity: parseFloat(quantity),
      custom_name: itemName.trim(),
      custom_unit: unit,
    })

    setItemName("")
    setQuantity("")
    setSelectedUnit("")
    setCustomUnit("")
    setUnitMode("preset")
    setOpen(false)
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full border-dashed text-sm"
      >
        Add custom item
      </Button>
    )
  }

  return (
    <div className="space-y-3 rounded-[20px] border border-dashed border-[var(--color-field-border)] bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-deep-leaf)]">
          Custom Item
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-[var(--color-muted-leaf)] hover:text-[var(--color-ink)] text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <Label className="text-xs font-bold uppercase tracking-tight text-[var(--color-text-secondary)]">Item Name</Label>
          <Input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Yam, Rice, Pepper..."
            className="h-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs font-bold uppercase tracking-tight text-[var(--color-text-secondary)]">Quantity</Label>
            <Input
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="h-10"
            />
          </div>
          <div>
            <Label className="text-xs font-bold uppercase tracking-tight text-[var(--color-text-secondary)]">Unit</Label>
            <Select value={unitMode} onValueChange={(v) => setUnitMode(v as "preset" | "custom")}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preset">Select Unit</SelectItem>
                <SelectItem value="custom">Custom Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {unitMode === "preset" && (
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Choose unit..." />
            </SelectTrigger>
            <SelectContent>
              {PRESET_UNITS.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {unitMode === "custom" && (
          <Input
            value={customUnit}
            onChange={(e) => setCustomUnit(e.target.value)}
            placeholder="e.g. Heap, Bowl, Plate..."
            className="h-10"
          />
        )}

        <Button
          onClick={handleAdd}
          disabled={!itemName.trim() || !quantity || parseFloat(quantity) <= 0 || !(unitMode === "preset" ? selectedUnit : customUnit)}
          className="w-full text-sm"
        >
          Add to request
        </Button>
      </div>
    </div>
  )
}
