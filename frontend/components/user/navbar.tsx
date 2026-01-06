"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Car, Calendar, CreditCard } from "lucide-react"
import { SignInButton, UserButton } from "@clerk/nextjs"

export default function UserNavbar() {
  const { user, clerkUser, isAdmin } = useAuth()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Car className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">RentHub</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/user">
              <Button variant="ghost">Browse Vehicles</Button>
            </Link>
            <Link href="/user/bookings">
              <Button variant="ghost" className="gap-2">
                <Calendar className="w-4 h-4" />
                My Bookings
              </Button>
            </Link>
            <Link href="/user/payments">
              <Button variant="ghost" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Payments
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
            )}
            {clerkUser ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground hidden sm:block">
                  Hello, <span className="font-semibold">{user?.name || clerkUser.firstName}</span>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

