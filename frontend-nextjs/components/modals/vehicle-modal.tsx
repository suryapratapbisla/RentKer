"use client"

import type React from "react"

import { useState } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Vehicle } from "@/types/vehicle"

interface VehicleModalProps {
  vehicle: Vehicle | null
  onClose: () => void
  onSave: (data: any) => void
}

export default function VehicleModal({ vehicle, onClose, onSave }: VehicleModalProps) {

  
  const [formData, setFormData] = useState({
    name: vehicle?.name || "",
    model: vehicle?.model || "",
    brand: vehicle?.brand || "",
    type: vehicle?.type?.toLowerCase?.() || "",
    plate_number: vehicle?.plate_number || "",
    status: vehicle?.status || "Available",
    rent_price: vehicle?.rent_price ? String(vehicle.rent_price) : "",
  })


  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      rent_price:
        formData.rent_price === "" ? 0 : Number(formData.rent_price),
    })
  }

  return (


    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Vehicle Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g., Toyota Camry"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Brand Name</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g., Tata, BMW"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g., 2023"
              required
            />
          </div>
          

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            >
              <option value="">Select Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">License Plate Number</label>
            <input
              type="text" 
              name="plate_number"
              value={formData.plate_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g., MH-12-3456"
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
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Daily Rate (₹)</label>
            <input
              type="number"
              name="rent_price"
              value={formData.rent_price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="₹ 50"
              required
            />
          </div>



          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:brightness-110 transition-all">
              {vehicle ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
