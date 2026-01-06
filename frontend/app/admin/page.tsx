"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Dashboard from "@/app/admin/dashboard/page"
import VehicleManagement from "@/app/admin/vehicles/page"
import UserManagement from "@/app/admin/users/page"
import BookingManagement from "@/app/admin/bookings/page"
import PaymentManagement from "@/app/admin/payments/page"
import ReviewsManagement from "@/app/admin/review/page"
import AnalyticsPage from "@/components/pages/analytics"
import { useAuth } from "@/context/AuthContext"

type Page = "dashboard" | "vehicles" | "users" | "bookings" | "payments" | "reviews" | "analytics"

export default function AdminPage() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/")
    }
  }, [isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "vehicles":
        return <VehicleManagement />
      case "users":
        return <UserManagement />
      case "bookings":
        return <BookingManagement />
      case "payments":
        return <PaymentManagement />
      case "reviews":
        return <ReviewsManagement />
      case "analytics":
        return <AnalyticsPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={(page) => setCurrentPage(page as Page)} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  )
}

