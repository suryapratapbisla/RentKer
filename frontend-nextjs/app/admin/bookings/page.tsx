"use client";

import { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle, Edit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table";
import BookingModal from "@/components/modals/booking-modal";
import axios from "axios";
import { Vehicle } from "@/types/vehicle"

interface UserDetails {
  _id: string;
  name: string;
}

interface Booking {
  _id: number;
  start_deadline: string;
  end_deadline: string;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
  total_amount: number;
  user_name: string;
  vehicle_id: Vehicle;
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {

    const fetchBookings = async () => {
    try {
      const bookingsResponse = await axios.get(
        "http://localhost:5000/api/v1/admin/bookings"
      );
      setBookings(bookingsResponse.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchAvailableVehicles = async () => {

    try {
      const vehiclesResponse = await axios.get(
        "http://localhost:5000/api/v1/admin/vehicle/available"
      );

      // console.log(vehiclesResponse.data.vehicles);
      
      setAvailableVehicles(vehiclesResponse.data.vehicles);
      
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
    }
  };

  fetchBookings();
  fetchAvailableVehicles();
  }, []);


  const filteredBookings = bookings.filter((b) => {
    const userName = b.user_name.toLowerCase() || "";
    const vehicleName = b.vehicle_id?.name?.toLowerCase() || "";

    return (
      userName.includes(searchTerm.toLowerCase()) ||
      vehicleName.includes(searchTerm.toLowerCase())
    );
});


  const handleApprove = (id: number) => {
    setBookings(
      bookings.map((b) => (b._id === id ? { ...b, status: "Confirmed" } : b))
    );
  };

  const handleCancel = (id: number) => {
    setBookings(
      bookings.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
    );
  };

  // If updated or Added it will update it
  const handleSaveBooking = async (data: any) => {
    const payload = {
      start_deadline: data.checkIn,
      end_deadline: data.checkOut,
      user_name: data.customer,
      vehicle_id: data.vehicle,
      status: data.status,
      total_amount: data.amount,
    };
  
    try {
      if (selectedBooking) {
        const { data: response } = await axios.put(
          `http://localhost:5000/api/v1/admin/bookings/update/${selectedBooking._id}`,
          payload
        );
        setBookings((prev) =>
          prev.map((b) => (b._id === selectedBooking._id ? response.booking : b))
        );
      } else {

        console.log("at createing the booking");
        

        const { data: response } = await axios.post(
          "http://localhost:5000/api/v1/admin/bookings/create",
          payload
        );
        setBookings((prev) => [...prev, response.booking]);
      }
    } catch (error) {
      console.error("Error saving booking:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-primary/20 text-primary border border-primary/50";
      case "Confirmed":
        return "bg-muted/30 text-foreground border border-border";
      case "Completed":
        return "bg-muted/20 text-muted-foreground border border-border";
      case "Pending":
        return "bg-destructive/20 text-destructive border border-destructive/50";
      case "Cancelled":
        return "bg-destructive/30 text-destructive border border-destructive/50";
      default:
        return "bg-muted/20 text-foreground border border-border";
    }
  };

  const columns = [
    {
      key: "customer",
      label: "Customer",
      render: (b: Booking) => <span>{b.user_name}</span>,
    },
    {
      key: "vehicle",
      label: "Vehicle",
      render: (b: Booking) => <span>{b.vehicle_id.name}</span>,
    },
    {
      key: "checkIn",
      label: "Check-In",
      render: (b: Booking) => (
        <span>{new Date(b.start_deadline).toLocaleDateString()}</span>
      ),
    },
    {
      key: "checkOut",
      label: "Check-Out",
      render: (b: Booking) => (
        <span>{new Date(b.end_deadline).toLocaleDateString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (b: Booking) => (
        <span
          className={`px-2 py-1 rounded-sm text-xs font-bold ${getStatusColor(
            b.status
          )}`}
        >
          {b.status}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (b: Booking) => (
        <span className="font-bold text-primary">${b.total_amount}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (b: Booking) => (
        <div className="flex gap-2">
          {b.status === "Pending" && (
            <>
              <button
                onClick={() => handleApprove(b._id)}
                className="p-2 hover:bg-primary/10 rounded-sm transition-colors"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4 text-primary" />
              </button>
              <button
                onClick={() => handleCancel(b._id)}
                className="p-2 hover:bg-destructive/10 rounded-sm transition-colors"
                title="Cancel"
              >
                <XCircle className="w-4 h-4 text-destructive" />
              </button>
            </>
          )}
          <button
            onClick={() => handleEditBooking(b)}
            className="p-2 hover:bg-primary/10 rounded-sm transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-primary" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest font-mono">
          BOOKING OPERATIONS
        </h1>
        <p className="text-xs text-foreground/60 mt-1 font-mono tracking-wide">
          MANAGE RENTAL RESERVATIONS
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-sm bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
          />
        </div>
        <Button
          onClick={() => {
            setSelectedBooking(null);
            setIsModalOpen(true);
          }}
          className="tactical-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Booking
        </Button>
      </div>

      <DataTable columns={columns} data={filteredBookings} />

      {isModalOpen && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
          onSave={handleSaveBooking}
          vehicles={availableVehicles}
        />
      )}
    </div>
  );
}
