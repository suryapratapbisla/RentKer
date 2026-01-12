"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import UserNavbar from "@/components/user/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Car, DollarSign, CreditCard, Star } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Vehicle } from "@/types/vehicle"
import { SignInButton } from "@clerk/nextjs"

interface Booking {
  _id: string
  start_deadline: string
  end_deadline: string
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled"
  total_amount: number
  user_name?: string
  vehicle_id: Vehicle
  payment_id?: string
  user_id?: {
    _id: string
    name: string
    email?: string
  }
}

interface ReviewData {
  rating: number
  comment: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export default function MyBookingsPage() {
  const { user, clerkUser } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 5,
    comment: "",
  })

  useEffect(() => {
    if (!user?._id) {
      setBookings([])
      setLoading(false)
      return
    }
    void fetchBookings()
  }, [user?._id])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/bookings`)
      const allBookings = response.data.bookings || []
      const userBookings = allBookings.filter((b: Booking) => b.user_id?._id === user?._id)
      setBookings(userBookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = (booking: Booking) => {
    router.push(`/user/payment/${booking._id}`)
  }

  const handleReview = (booking: Booking) => {
    setSelectedBooking(booking)
    setReviewDialogOpen(true)
  }

  const submitReview = async () => {
    if (!selectedBooking || !user?._id) {
      toast.error("Unable to find your profile. Please try again.")
      return
    }

    if (!reviewData.comment.trim()) {
      toast.error("Please enter a review comment")
      return
    }

    try {
      const reviewPayload = {
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString(),
        user_id: user._id,
        vehicle_id: selectedBooking.vehicle_id._id,
      }

      // You'll need to create this endpoint in the backend
      await axios.post(`${API_BASE_URL}/api/v1/user/reviews`, reviewPayload)
      toast.success("Review submitted successfully!")
      setReviewDialogOpen(false)
      setReviewData({ rating: 5, comment: "" })
      setSelectedBooking(null)
    } catch (error: any) {
      console.error("Error submitting review:", error)
      toast.error(error.response?.data?.message || "Failed to submit review")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "default"
      case "Active":
        return "default"
      case "Completed":
        return "default"
      case "Pending":
        return "secondary"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (!clerkUser) {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        <div className="container mx-auto px-4 py-24 text-center space-y-6">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-3xl font-bold mb-2">Sign in to view your bookings</h2>
            <p className="text-muted-foreground">Access and manage all of your reservations in one place.</p>
          </div>
          <SignInButton mode="modal">
            <Button size="lg">Sign in</Button>
          </SignInButton>
        </div>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">No bookings found</p>
              <Button
                onClick={() => router.push("/user")}
                className="mt-4"
              >
                Browse Vehicles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      {booking.vehicle_id?.name || "Unknown Vehicle"}
                    </CardTitle>
                    <Badge variant={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-semibold">
                        {new Date(booking.start_deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-semibold">
                        {new Date(booking.end_deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {booking.total_amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle Type</p>
                      <p className="font-semibold capitalize">
                        {booking.vehicle_id?.type || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {booking.status === "Pending" && !booking.payment_id && (
                      <Button
                        onClick={() => handlePayment(booking)}
                        className="gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Make Payment
                      </Button>
                    )}
                    {booking.status === "Completed" && (
                      <Button
                        variant="outline"
                        onClick={() => handleReview(booking)}
                        className="gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Write Review
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with {selectedBooking?.vehicle_id?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating })}
                      className={`p-2 rounded ${
                        reviewData.rating >= rating
                          ? "text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          reviewData.rating >= rating ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience..."
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setReviewDialogOpen(false)
                  setReviewData({ rating: 5, comment: "" })
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={submitReview} className="flex-1">
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

