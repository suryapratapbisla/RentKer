"use client"

import type React from "react"
import { useState } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Vehicle } from "@/types/vehicle"

interface UserDetails {
  _id: string;
  name: string;
}

interface Booking {
  _id: number;
  start_deadline: string;
  end_deadline: string;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
  total_amount: number;
  user_name: string;
  vehicle_id: Vehicle;
}


interface BookingModalProps {
  booking: Booking | null
  onClose: () => void
  onSave: (data: any) => void
  vehicles: Vehicle[]
}

export default function BookingModal({ booking, onClose, onSave, vehicles }: BookingModalProps) {

  const [formData, setFormData] = useState({
    customer: booking?.user_name || "",
    vehicle: booking?.vehicle_id.name || "",
    checkIn: booking?.start_deadline || "",
    checkOut: booking?.end_deadline || "",
    status: booking?.status || "Pending",
    amount: booking?.total_amount || 0,
  })

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{booking ? "Edit Booking" : "Add New Booking"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Customer Name</label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Vehicle</label>
            <select
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => {
                return (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                )
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Check-In Date</label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Check-Out Date</label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Total Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="150"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:brightness-110 transition-all">
              {booking ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
