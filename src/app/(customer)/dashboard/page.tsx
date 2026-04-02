"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Order, OrderStatus, CartItem, Product, Profile } from "@/types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { CustomItemForm } from "@/components/order-form/CustomItemForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DashboardPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [editAddress, setEditAddress] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [editCart, setEditCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [errorDialog, setErrorDialog] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [editProfileData, setEditProfileData] = useState({
    full_name: "",
    organisation: "",
    phone: "",
    contact: "",
    location: ""
  })
  const [savingProfile, setSavingProfile] = useState(false)

  const fetchOrders = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // Fetch profile
    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      
    if (profileData) {
      setProfile(profileData as Profile)
    }

    // Fetch orders
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setOrders(data as Order[])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("available", true)
    if (data) setProducts(data)
  }

  const getStatusBadgeClass = (status: OrderStatus) => {
    const base = "font-heading text-xs uppercase tracking-wider px-2 py-1"
    switch (status) {
      case "pending":
        return `${base} bg-[var(--color-amber-light)] text-[var(--color-amber)]`
      case "confirmed":
        return `${base} bg-[var(--color-blue-light)] text-[var(--color-blue)]`
      case "processing":
        return `${base} bg-[var(--color-purple-light)] text-[var(--color-purple)]`
      case "out_for_delivery":
        return `${base} bg-[var(--color-orange-light)] text-[var(--color-orange)]`
      case "delivered":
        return `${base} bg-[var(--color-accent-light)] text-[var(--color-accent)]`
      default:
        return base
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleCancel = async () => {
    if (!cancelId) return

    const response = await fetch(`/api/orders?order_id=${cancelId}`, {
      method: "DELETE",
    })

    const result = await response.json()

    if (result.error) {
      setErrorDialog(result.error)
      setCancelId(null)
      return
    }

    setOrders((prev) => prev.filter((o) => o.id !== cancelId))
    setCancelId(null)
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    setEditAddress(order.delivery_address)
    setEditNotes(order.delivery_notes || "")
    setEditCart(
      (order.order_items || []).map((item) => ({
        product: item.product_id ? {
          id: item.product_id,
          name: item.product_name,
          unit: item.unit,
          category: "",
          available: true,
        } : null,
        quantity: item.quantity,
        custom_name: !item.product_id ? item.product_name : undefined,
        custom_unit: !item.product_id ? item.unit : undefined,
      }))
    )
    fetchProducts()
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingOrder) return
    if (editCart.length === 0) {
      setErrorDialog("At least one item is required")
      return
    }
    if (!editAddress.trim()) {
      setErrorDialog("Delivery address is required")
      return
    }

    setSaving(true)
    try {
      const items = editCart.map((item) => ({
        product_id: item.product?.id || null,
        product_name: item.product?.name || item.custom_name || "",
        unit: item.product?.unit || item.custom_unit || "",
        quantity: item.quantity,
      }))

      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: editingOrder.id,
          items,
          delivery_address: editAddress,
          delivery_notes: editNotes,
        }),
      })

      const result = await response.json()

      if (result.error) {
        setErrorDialog(result.error)
        return
      }

      setShowEditModal(false)
      setEditingOrder(null)
      fetchOrders()
    } catch {
      setErrorDialog("Failed to update order")
    } finally {
      setSaving(false)
    }
  }

  const handleEditQuantityChange = (product: Product, value: string) => {
    const qty = parseFloat(value) || 0
    setEditCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (qty <= 0) {
        return prev.filter((item) => item.product.id !== product.id)
      }
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: qty } : item
        )
      }
      return [...prev, { product, quantity: qty }]
    })
  }

  const handleEditProfile = () => {
    setEditProfileData({
      full_name: profile?.full_name || "",
      organisation: profile?.organisation || "",
      phone: profile?.phone || "",
      contact: profile?.contact || "",
      location: profile?.location || "",
    })
    setShowProfileModal(true)
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProfileData),
      })

      const result = await response.json()

      if (result.error) {
        setErrorDialog(result.error)
        return
      }

      setShowProfileModal(false)
      fetchOrders() // Re-fetch profile along with orders
    } catch {
      setErrorDialog("Failed to update profile")
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold uppercase tracking-wider">
            My Orders
          </h1>
          <Link href="/order">
            <Button
              variant="outline"
              className="font-heading uppercase tracking-wider text-xs lg:text-sm"
            >
              Place New Order
            </Button>
          </Link>
        </div>

        <div className="border-b-4 border-black mb-6"></div>

        {/* Profile Section */}
        {!loading && profile && (
          <div className="mb-10 bg-white border-2 border-black p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider">
                My Profile
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="font-heading uppercase tracking-wider text-xs"
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--color-text-muted)] font-heading uppercase tracking-wider">Full Name</p>
                <p className="font-medium">{profile.full_name || <span className="text-gray-400 italic">Not set</span>}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] font-heading uppercase tracking-wider">Organisation</p>
                <p className="font-medium">{profile.organisation || <span className="text-gray-400 italic">Not set</span>}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] font-heading uppercase tracking-wider">Phone</p>
                <p className="font-medium">{profile.phone || <span className="text-gray-400 italic">Not set</span>}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)] font-heading uppercase tracking-wider">Alt. Contact</p>
                <p className="font-medium">{profile.contact || <span className="text-gray-400 italic">Not set</span>}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-[var(--color-text-muted)] font-heading uppercase tracking-wider">Location</p>
                <p className="font-medium">{profile.location || <span className="text-gray-400 italic">Not set</span>}</p>
              </div>
            </div>
          </div>
        )}

        <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-4">
          Order History
        </h2>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)] mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/order">
              <Button
                variant="outline"
                className="font-heading uppercase tracking-wider"
              >
                Place Your First Order
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="font-heading text-xs lg:text-sm font-semibold uppercase tracking-wider text-left py-3 pr-4">
                    Order No.
                  </th>
                  <th className="font-heading text-xs lg:text-sm font-semibold uppercase tracking-wider text-left py-3 pr-4">
                    Date
                  </th>
                  <th className="font-heading text-xs lg:text-sm font-semibold uppercase tracking-wider text-left py-3 pr-4 hidden sm:table-cell">
                    Items
                  </th>
                  <th className="font-heading text-xs lg:text-sm font-semibold uppercase tracking-wider text-left py-3 pr-4">
                    Status
                  </th>
                  <th className="font-heading text-xs lg:text-sm font-semibold uppercase tracking-wider text-left py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--color-border-light)]"
                  >
                    <td className="py-4 pr-4">
                      <span className="font-mono text-xs lg:text-sm">{order.order_number}</span>
                    </td>
                    <td className="py-4 pr-4 text-xs lg:text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-4 pr-4 text-xs lg:text-sm hidden sm:table-cell">
                      {order.order_items?.length || 0} items
                    </td>
                    <td className="py-4 pr-4">
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/${order.id}`}>
                          <Button variant="link" size="sm" className="p-0 font-heading uppercase tracking-wider text-xs">
                            View
                          </Button>
                        </Link>
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleEdit(order)}
                              className="font-heading uppercase tracking-wider text-xs text-[var(--color-blue)] hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setCancelId(order.id)}
                              className="font-heading uppercase tracking-wider text-xs text-[var(--color-danger)] hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelId(null)}>
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
            >
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!errorDialog} onOpenChange={() => setErrorDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorDialog}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorDialog(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Order {editingOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider mb-3">
                Order Items
              </h3>
              <div className="space-y-2">
                {editCart.filter((c) => c.product).map((item) => {
                  const product = item.product!
                  const qty = editCart.find((c) => c.product?.id === product.id)?.quantity || 0
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border border-[var(--color-border-light)]"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          per {product.unit}
                        </p>
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={qty || ""}
                          onChange={(e) => handleEditQuantityChange(product, e.target.value)}
                          placeholder="0"
                          className="text-right h-8"
                        />
                      </div>
                    </div>
                  )
                })}
                {editCart.filter((c) => !c.product).map((item, idx) => (
                  <div
                    key={`custom-${idx}`}
                    className="flex items-center justify-between p-3 border border-[var(--color-border-light)] bg-[var(--color-accent-light)]"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.custom_name}
                        <span className="ml-1 text-[10px] text-[var(--color-accent)] uppercase tracking-wider">
                          (custom)
                        </span>
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {item.quantity} {item.custom_unit}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditCart((prev) => prev.filter((c) => c !== item))}
                      className="text-[var(--color-danger)] text-lg ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <CustomItemForm
                  onAdd={(item) => setEditCart((prev) => [...prev, item])}
                />
              </div>
            </div>

            <div>
              <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
                Delivery Address
              </label>
              <Textarea
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
                Notes (Optional)
              </label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Any special instructions..."
                className="min-h-[60px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <Input
                value={editProfileData.full_name}
                onChange={(e) => setEditProfileData({ ...editProfileData, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
                Organisation
              </label>
              <Input
                value={editProfileData.organisation}
                onChange={(e) => setEditProfileData({ ...editProfileData, organisation: e.target.value })}
                placeholder="Company or Farm name"
              />
            </div>
            <div>
              <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <Input
                value={editProfileData.phone}
                onChange={(e) => setEditProfileData({ ...editProfileData, phone: e.target.value })}
                placeholder="024XXXXXXX"
              />
            </div>
            <div>
              <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
                Alternate Contact (Email/Phone)
              </label>
              <Input
                value={editProfileData.contact}
                onChange={(e) => setEditProfileData({ ...editProfileData, contact: e.target.value })}
                placeholder="Secondary contact info"
              />
            </div>
            <div>
              <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-1">
                Location / Address
              </label>
              <Textarea
                value={editProfileData.location}
                onChange={(e) => setEditProfileData({ ...editProfileData, location: e.target.value })}
                placeholder="Enter your location or delivery address"
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
