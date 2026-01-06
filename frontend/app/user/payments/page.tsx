"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { SignInButton } from "@clerk/nextjs"
import UserNavbar from "@/components/user/navbar"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, DollarSign } from "lucide-react"
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

interface Payment {
  _id: string
  amount: number
  amount_paid: number
  status: "pending" | "paid" | "failed"
  payment_method: string
  payment_date: string
  booking_id?: {
    _id: string
    start_deadline: string
    end_deadline: string
    vehicle_id?: {
      name: string
      model: string
      type: string
    }
  }
}

export default function PaymentHistoryPage() {
  const { user, clerkUser } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?._id) {
      setLoading(false)
      return
    }
    void fetchPayments()
  }, [user?._id])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/v1/user/payments/${user?._id}`)
      setPayments(response.data.payments || [])
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast.error("Unable to load payment history")
    } finally {
      setLoading(false)
    }
  }

  if (!clerkUser) {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        <div className="container mx-auto px-4 py-24 text-center space-y-6">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-3xl font-bold mb-2">Sign in to view payment history</h2>
            <p className="text-muted-foreground">
              You need to be signed in to see your previous payments and invoices.
            </p>
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
          <p className="mt-4 text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Payment History</h1>
          <p className="text-muted-foreground">
            Review all the payments you&apos;ve made for your bookings.
          </p>
        </div>

        {payments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto" />
              <p className="text-lg text-muted-foreground">No payments found.</p>
              <Button onClick={fetchPayments}>Refresh</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <Card key={payment._id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment #{payment._id.slice(-6).toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.payment_date).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      payment.status === "paid"
                        ? "default"
                        : payment.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {payment.status.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <DollarSign className="w-4 h-4" />
                      ${payment.amount_paid ?? payment.amount}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Method:{" "}
                      <span className="font-medium capitalize">
                        {payment.payment_method?.replace("_", " ") || "N/A"}
                      </span>
                    </div>
                    {payment.booking_id && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(payment.booking_id.start_deadline).toLocaleDateString()} -{" "}
                        {new Date(payment.booking_id.end_deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {payment.booking_id?.vehicle_id && (
                    <div className="text-sm text-muted-foreground">
                      Vehicle:{" "}
                      <span className="font-medium">
                        {payment.booking_id.vehicle_id.name} {payment.booking_id.vehicle_id.model} (
                        {payment.booking_id.vehicle_id.type})
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

