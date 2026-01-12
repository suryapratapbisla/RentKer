"use client"

import MetricCard from "@/components/metric-card"
import EarningsChart from "@/components/charts/earnings-chart"
import BookingTrendsChart from "@/components/charts/booking-trends-chart"
import TopVehiclesChart from "@/components/charts/top-vehicles-chart"
import RecentBookings from "@/components/recent-bookings"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Dashboard() {

  const [total_vehicle, setTotal_vehicle] = useState('');
  const [active_bookings, setActive_bookings] = useState('');
  const [total_users, setTotal_users] = useState('');
  const [total_revenue, setTotal_revenue] = useState('');
  const [pending_payments, setPending_payments] = useState('');
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect( () => {

    const fetchData = async () => {
    const total_vehicle_response = await axios.get('http://localhost:5000/api/v1/admin/vehicles/total');
    const active_bookings_response = await axios.get('http://localhost:5000/api/v1/admin/bookings/active');
    const total_bookings_response = await axios.get('http://localhost:5000/api/v1/admin/bookings/total');
    const total_revenue_response = await axios.get('http://localhost:5000/api/v1/admin/payments/total-revenue');
    const pending_payments_response = await axios.get('http://localhost:5000/api/v1/admin/payments/pending');


    setTotal_vehicle(total_vehicle_response?.data.total);
    setActive_bookings(active_bookings_response?.data.total);
    setTotal_users(total_bookings_response?.data.total);
    setTotal_revenue(total_revenue_response?.data.total);
    setPending_payments(pending_payments_response?.data.total);
    
    }


    const fetchRecentBooking = async () => {
      const recent_bookings_response = await axios.get('http://localhost:5000/api/v1/admin/bookings/recent');
      setRecentBookings(recent_bookings_response?.data.bookings);
      console.log(recent_bookings_response.data);
      
    }

    fetchData();
    fetchRecentBooking();
  
  },[])


  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="p-8 space-y-6">
        <div className="pb-4 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back to RentHub</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard 
          title="Total Vehicles" 
          value={total_vehicle} 
          icon="🚗" 
          trend={12} 
          bgColor="bg-primary/10" />
          <MetricCard
            title="Active Bookings"
            value={active_bookings}
            icon="📅"
            trend={8}
            bgColor="bg-primary/10"
          />
          <MetricCard
            title="Total Users"
            value={total_users}
            icon="👥"
            trend={15}
            bgColor="bg-primary/10"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${total_revenue}`}
            icon="💰"
            trend={22}
            bgColor="bg-primary/10"
          />
          <MetricCard
            title="Pending Payments"
            value={`$${pending_payments}`}
            icon="⏳"
            trend={-5}
            bgColor="bg-destructive/10"
          />
        </div>

        {/* Charts Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="card-title mb-4">Monthly Earnings</h2>
            <EarningsChart />
          </div>
          <div className="card">
            <h2 className="card-title mb-4">Booking Trends</h2>
            <BookingTrendsChart />
          </div>
        </div> */}

        {/* Full Width Chart */}
        

        {/* Recent Bookings */}
        <RecentBookings 
        bookings={recentBookings}
        />
      </div>
    </div>
  )
}
