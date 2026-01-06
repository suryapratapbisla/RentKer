"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import UserNavbar from "@/components/user/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Car, Calendar, DollarSign } from "lucide-react"
import axios from "axios"
import { Vehicle } from "@/types/vehicle"
import { toast } from "sonner"
import { SignInButton } from "@clerk/nextjs"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

interface BookingData {
  start_deadline: string
  end_deadline: string
  total_amount: number
  user_name: string
  user_id: string
  vehicle_id: string
  status: string
}

export default function VehicleDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
  })
  const [calculatedAmount, setCalculatedAmount] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchVehicle()
  }, [vehicleId])

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate && vehicle) {
      const start = new Date(bookingData.startDate)
      const end = new Date(bookingData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      if (days > 0) {
        setCalculatedAmount(days * (vehicle.rent_price || 0))
      } else {
        setCalculatedAmount(0)
      }
    } else {
      setCalculatedAmount(0)
    }
  }, [bookingData, vehicle])

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/vehicles`)
      const vehicles = response.data.vehicles || []
      const foundVehicle = vehicles.find((v: Vehicle) => v._id === vehicleId)
      if (foundVehicle) {
        setVehicle(foundVehicle)
      } else {
        toast.error("Vehicle not found")
        router.push("/user")
      }
    } catch (error) {
      console.error("Error fetching vehicle:", error)
      toast.error("Failed to load vehicle details")
    } finally {
      setLoading(false)
    }
  }

  const handleBookingRequest = async () => {
    if (!vehicle) return

    if (!user) {
      toast.error("Please sign in to book this vehicle")
      router.push("/user/login")
      return
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error("Please select both start and end dates")
      return
    }

    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)

    if (end <= start) {
      toast.error("End date must be after start date")
      return
    }

    setSubmitting(true)

    try {
      const bookingPayload: BookingData = {
        start_deadline: start.toISOString(),
        end_deadline: end.toISOString(),
        total_amount: calculatedAmount,
        user_name: user.name,
        user_id: user._id,
        vehicle_id: vehicle._id,
        status: "Pending",
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/v1/admin/bookings/create`,
        bookingPayload
      )

      if (response.data.booking) {
        toast.success("Booking request submitted successfully!")
        setBookingDialogOpen(false)
        router.push("/user/bookings")
      } else {
        toast.error("Failed to submit booking request")
      }
    } catch (error: any) {
      console.error("Error creating booking:", error)
      toast.error(error.response?.data?.message || "Failed to submit booking request")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Image */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {vehicle.media && typeof vehicle.media === "string" ? (
              <img
                src={vehicle.media}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-32 h-32 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{vehicle.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={vehicle.status === "Available" ? "default" : "secondary"}>
                  {vehicle.status}
                </Badge>
                <span className="text-muted-foreground capitalize">{vehicle.type}</span>
              </div>
              <div className="flex items-center gap-2 text-lg text-muted-foreground">
                <span>{vehicle.brand}</span>
                <span>•</span>
                <span>{vehicle.model}</span>
                {vehicle.plate_number && (
                  <>
                    <span>•</span>
                    <span>{vehicle.plate_number}</span>
                  </>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${vehicle.rent_price}
                  <span className="text-lg font-normal text-muted-foreground">/day</span>
                </div>
              </CardContent>
            </Card>

            {vehicle.status === "Available" ? (
              user ? (
                <Button size="lg" className="w-full" onClick={() => setBookingDialogOpen(true)}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Book This Vehicle
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button size="lg" className="w-full">
                    <Calendar className="w-5 h-5 mr-2" />
                    Sign in to Book
                  </Button>
                </SignInButton>
              )
            ) : (
              <Button size="lg" className="w-full" disabled>
                Currently Unavailable
              </Button>
            )}
          </div>
        </div>

        {/* Booking Dialog */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book {vehicle.name}</DialogTitle>
              <DialogDescription>
                Select your rental dates and we'll calculate the total amount
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, startDate: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, endDate: e.target.value })
                  }
                  min={bookingData.startDate || new Date().toISOString().split("T")[0]}
                />
              </div>
              {calculatedAmount > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="text-2xl font-bold">${calculatedAmount}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setBookingDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookingRequest}
                disabled={submitting || calculatedAmount === 0}
                className="flex-1"
              >
                {submitting ? "Submitting..." : "Submit Booking Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

