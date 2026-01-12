"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import UserNavbar from "@/components/user/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, CheckCircle, Lock } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Vehicle } from "@/types/vehicle"
import { SignInButton } from "@clerk/nextjs"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

interface Booking {
  _id: string
  start_deadline: string
  end_deadline: string
  status: string
  total_amount: number
  user_name: string
  vehicle_id: Vehicle
  user_id?: { _id: string } | string
}

export default function PaymentPage() {
  const { user, clerkUser } = useAuth()
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  useEffect(() => {
    if (!user?._id) {
      setBooking(null)
      setLoading(false)
      return
    }
    void fetchBooking()
  }, [bookingId, user?._id])

  const fetchBooking = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/bookings`)
      const bookings = response.data.bookings || []
      const foundBooking = bookings.find((b: Booking) => b._id === bookingId)
      if (foundBooking) {
        const bookingOwnerId =
          typeof foundBooking.user_id === "string"
            ? foundBooking.user_id
            : foundBooking.user_id?._id

        if (bookingOwnerId && user?._id && bookingOwnerId !== user._id) {
          toast.error("You are not authorized to pay for this booking")
          router.replace("/user/bookings")
          return
        }
        setBooking(foundBooking)
      } else {
        toast.error("Booking not found")
        router.push("/user/bookings")
      }
    } catch (error) {
      console.error("Error fetching booking:", error)
      toast.error("Failed to load booking details")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!booking || !user?._id) {
      toast.error("Missing user information. Please try again.")
      return
    }

    // Validate card data
    if (
      !cardData.cardNumber ||
      !cardData.expiryDate ||
      !cardData.cvv ||
      !cardData.cardholderName
    ) {
      toast.error("Please fill in all payment details")
      return
    }

    setProcessing(true)

    try {
      // Create payment record
      const paymentPayload = {
        amount: booking.total_amount,
        amount_paid: booking.total_amount,
        status: "paid",
        booking_id: booking._id,
        user_id: user._id,
        payment_method: paymentMethod,
        payment_date: new Date().toISOString(),
      }

      // You'll need to create this endpoint in the backend
      const paymentResponse = await axios.post(`${API_BASE_URL}/api/v1/user/payments`, paymentPayload)

      if (paymentResponse.data.payment) {
        // Update booking status to Confirmed
        await axios.put(`${API_BASE_URL}/api/v1/admin/bookings/update/${booking._id}`, {
          ...booking,
          status: "Confirmed",
          payment_id: paymentResponse.data.payment._id,
        })

        toast.success("Payment successful! Your booking is confirmed.")
        router.push("/user/bookings")
      } else {
        toast.error("Payment failed. Please try again.")
      }
    } catch (error: any) {
      console.error("Error processing payment:", error)
      toast.error(error.response?.data?.message || "Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (!clerkUser) {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        <div className="container mx-auto px-4 py-24 text-center space-y-6">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-3xl font-bold mb-2">Sign in to continue</h2>
            <p className="text-muted-foreground">You need to sign in to complete your booking payment.</p>
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

  if (!booking) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="font-semibold">{booking.vehicle_id?.name}</p>
              </div>
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
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Total Amount</p>
                  <p className="text-2xl font-bold">${booking.total_amount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Secure Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debit_card" id="debit_card" />
                    <Label htmlFor="debit_card">Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer">Bank Transfer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </div>

              {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={cardData.cardholderName}
                      onChange={(e) =>
                        setCardData({ ...cardData, cardholderName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          cardNumber: e.target.value.replace(/\s/g, ""),
                        })
                      }
                      maxLength={16}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={cardData.expiryDate}
                        onChange={(e) =>
                          setCardData({ ...cardData, expiryDate: e.target.value })
                        }
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) =>
                          setCardData({ ...cardData, cvv: e.target.value })
                        }
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {(paymentMethod === "bank_transfer" || paymentMethod === "paypal") && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod === "bank_transfer"
                      ? "You will be redirected to complete the bank transfer."
                      : "You will be redirected to PayPal to complete the payment."}
                  </p>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full"
                size="lg"
              >
                {processing ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay ${booking.total_amount}
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

