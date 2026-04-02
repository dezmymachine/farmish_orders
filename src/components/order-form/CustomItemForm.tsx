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
        className="w-full uppercase tracking-widest font-heading font-semibold text-xs border-dashed"
      >
        + Add Custom Item
      </Button>
    )
  }

  return (
    <div className="space-y-3 p-3 border-2 border-dashed border-[var(--color-border-light)]">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
          Custom Item
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <Label className="font-heading text-xs uppercase tracking-wider">Item Name</Label>
          <Input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Yam, Rice, Pepper..."
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="font-heading text-xs uppercase tracking-wider">Quantity</Label>
            <Input
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="h-9"
            />
          </div>
          <div>
            <Label className="font-heading text-xs uppercase tracking-wider">Unit</Label>
            <Select value={unitMode} onValueChange={(v) => setUnitMode(v as "preset" | "custom")}>
              <SelectTrigger className="h-9">
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
            <SelectTrigger className="h-9">
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
            className="h-9"
          />
        )}

        <Button
          onClick={handleAdd}
          disabled={!itemName.trim() || !quantity || parseFloat(quantity) <= 0 || !(unitMode === "preset" ? selectedUnit : customUnit)}
          className="w-full uppercase tracking-widest font-heading font-semibold text-xs"
        >
          Add to Order
        </Button>
      </div>
    </div>
  )
}
