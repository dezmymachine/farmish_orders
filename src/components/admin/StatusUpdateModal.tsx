"use client"

import { useState } from "react"
import { OrderStatus } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "out_for_delivery",
  "delivered",
]

interface StatusUpdateModalProps {
  orderId: string
  currentStatus: OrderStatus
  onUpdate: (newStatus: OrderStatus, note: string) => void
}

export function StatusUpdateModal({
  orderId,
  currentStatus,
  onUpdate,
}: StatusUpdateModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await onUpdate(selectedStatus, note)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          variant="outline"
          size="sm"
          className="font-heading uppercase tracking-wider text-xs"
        >
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading uppercase tracking-wider">
            Update Order Status
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-2">
              Current Status
            </label>
            <p className="text-sm text-[var(--color-text-secondary)] uppercase">
              {currentStatus.replace(/_/g, " ")}
            </p>
          </div>
          <div>
            <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-2">
              New Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="font-heading text-sm font-semibold uppercase tracking-wider block mb-2">
              Internal Note (Optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this status change..."
            />
          </div>
          <Button
            onClick={handleUpdate}
            disabled={loading || selectedStatus === currentStatus}
            className="w-full uppercase tracking-widest font-heading font-semibold"
          >
            {loading ? "Updating..." : "Confirm Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
