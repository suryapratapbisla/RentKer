"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { SignInButton } from "@clerk/nextjs"
import { useAuth } from "@/context/AuthContext"
import UserNavbar from "@/components/user/navbar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Car, DollarSign } from "lucide-react"
import { Vehicle } from "@/types/vehicle"
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export default function UserHomePage() {
  const { user, clerkUser } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchVehicles()
  }, [])

  useEffect(() => {
    filterVehicles()
  }, [searchTerm, typeFilter, vehicles])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/vehicle/available`)
      setVehicles(response.data.vehicles || [])
    } catch (error) {
      console.error("Error fetching vehicles:", error)
      toast.error("Failed to load vehicles")
    } finally {
      setLoading(false)
    }
  }

  const filterVehicles = () => {
    let filtered = vehicles

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.model.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((v) => v.type === typeFilter)
    }

    setFilteredVehicles(filtered)
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
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Browse Vehicles</h1>
            <p className="text-muted-foreground">Find your perfect ride for your next trip.</p>
          </div>
          {!clerkUser && (
            <SignInButton mode="modal">
              <Button size="lg">Sign in to Book</Button>
            </SignInButton>
          )}
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "car", "bike", "scooter"].map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? "default" : "outline"}
                onClick={() => setTypeFilter(type)}
                size="sm"
                className="capitalize"
              >
                {type === "all" ? "All" : `${type}s`}
              </Button>
            ))}
          </div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No vehicles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  {vehicle.media && typeof vehicle.media === "string" ? (
                    <img src={vehicle.media} alt={vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <Badge
                    className="absolute top-2 right-2"
                    variant={vehicle.status === "Available" ? "default" : "secondary"}
                  >
                    {vehicle.status}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{vehicle.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{vehicle.brand}</span>
                    <span>•</span>
                    <span>{vehicle.model}</span>
                    <span>•</span>
                    <span className="capitalize">{vehicle.type}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">${vehicle.rent_price}</span>
                    <span className="text-muted-foreground">/day</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/user/vehicles/${vehicle._id}`} className="w-full">
                    <Button className="w-full">{vehicle.status === "Available" ? "View Details & Book" : "View Details"}</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

