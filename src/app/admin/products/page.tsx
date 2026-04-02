"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const categories = [
  "Grains & Cereals",
  "Vegetables",
  "Tubers & Roots",
  "Processed",
  "Spices & Herbs",
  "Legumes",
  "Seafood & Proteins",
  "Leaves & Herbs",
  "Oils & Fats",
  "Fruits",
  "Condiments",
]

const units = ["kg", "liter", "bundle", "bottle", "bunch", "piece", "pack"]

export default function AdminProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "kg",
  })

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true })

      if (!error && data) {
        setProducts(data as Product[])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [supabase])

  const handleToggleAvailability = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ available: !product.available } as never)
      .eq("id", product.id)

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, available: !p.available } : p))
      )
    }
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        unit: product.unit,
      })
    } else {
      setEditingProduct(null)
      setFormData({ name: "", category: "", unit: "kg" })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.category) return

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          category: formData.category,
          unit: formData.unit,
        } as never)
        .eq("id", editingProduct.id)

      if (!error) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? { ...p, name: formData.name, category: formData.category, unit: formData.unit }
              : p
          )
        )
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: formData.name,
          category: formData.category,
          unit: formData.unit,
        } as any)
        .select()
        .single()

      if (!error && data) {
        setProducts((prev) => [...prev, data as Product])
      }
    }

    setDialogOpen(false)
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[var(--color-bg)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">
            Products
          </h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button
                onClick={() => handleOpenDialog()}
                variant="outline"
                className="font-heading uppercase tracking-wider"
              >
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-heading uppercase tracking-wider">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-2">
                    Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-9 border border-input px-3 py-1 text-sm focus-visible:border-ring"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-2">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full h-9 border border-input px-3 py-1 text-sm focus-visible:border-ring"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={!formData.name || !formData.category}
                  className="w-full uppercase tracking-widest font-heading font-semibold"
                >
                  {editingProduct ? "Save Changes" : "Add Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border-b-4 border-black mb-6"></div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)]">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-left py-3 pr-4">
                    Name
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-left py-3 pr-4">
                    Category
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-left py-3 pr-4">
                    Unit
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-left py-3 pr-4">
                    Available
                  </th>
                  <th className="font-heading text-xs font-semibold uppercase tracking-wider text-left py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[var(--color-border-light)]"
                  >
                    <td className="py-3 pr-4 text-sm">{product.name}</td>
                    <td className="py-3 pr-4 text-sm">{product.category}</td>
                    <td className="py-3 pr-4 text-sm">{product.unit}</td>
                    <td className="py-3 pr-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={product.available}
                          onChange={() => handleToggleAvailability(product)}
                          className="w-4 h-4 accent-[var(--color-accent)]"
                        />
                        <span className="text-sm">
                          {product.available ? "Yes" : "No"}
                        </span>
                      </label>
                    </td>
                    <td className="py-3">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleOpenDialog(product)}
                        className="p-0 font-heading uppercase tracking-wider text-xs"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
