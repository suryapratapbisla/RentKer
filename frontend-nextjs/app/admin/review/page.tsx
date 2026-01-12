"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Star } from 'lucide-react'
import DataTable from "@/components/data-table"
import { Vehicle } from "@/types/vehicle";
import axios from "axios";

interface UserDetails {
  _id: string;
  name: string;
}

interface Review {
  _id: number
  user_id: UserDetails
  rating: number
  vehicle_id: Vehicle
  comment: string
  date: string
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([])

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(()=>{
    const fetchReview = async () => {
      try {
        const reviewsResponse = await axios.get('http://localhost:5000/api/v1/admin/reviews');
  
        console.log(reviewsResponse);
  
        setReviews(reviewsResponse.data.reviews)
      } catch (error) {
        console.log("Error fetching the reviews: ", error);
        
      }
    }

    fetchReview();
  },[])


  

  const filteredReviews = reviews.filter(
    (r) =>
      r.user_id?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicle_id?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteReview = (id: number) => {
    setReviews(reviews.filter((r) => r._id !== id))
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      ))}
    </div>
  )

  const columns = [
    { key: "customer", label: "Customer",
      render: (r: Review) => <span>{r.user_id.name}</span>
     },
    { key: "vehicle", label: "Vehicle",
      render: (r: Review) => <span>{r.vehicle_id.name + " " + r.vehicle_id.model}</span>
     },
    { key: "rating", label: "Rating", render: (r: Review) => renderStars(r.rating) },
    { key: "comment", label: "Comment" },
    { key: "date", label: "Date",
      render: (r: Review)=> <span>{new Date(r.date).toLocaleDateString()}</span>,
     },
    {
      key: "actions",
      label: "Actions",
      render: (r: Review) => (
        <button onClick={() => handleDeleteReview(r._id)} className="p-2 hover:bg-destructive/10 rounded-sm transition-colors">
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest font-mono">REVIEWS MANAGEMENT</h1>
        <p className="text-xs text-foreground/60 mt-1 font-mono tracking-wide">CUSTOMER FEEDBACK SYSTEM</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-sm bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
        />
      </div>

      <DataTable columns={columns} data={filteredReviews} />
    </div>
  )
}
