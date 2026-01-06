"use client";

import { useEffect, useState } from "react";
import { Search, Check, Clock, XCircle } from "lucide-react";
import DataTable from "@/components/data-table";
import axios from "axios";

interface UserDetails {
  _id: string;
  name: string; 
}

interface Payment {
  _id: string;
  booking_id: number;
  amount_paid: number;
  user_id: UserDetails;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  payment_method: "credit_card" | "debit_card" | "bank_transfer" | "paypal";
  payment_date: Date;
}

export default function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        await axios
          .get("http://localhost:5000/api/v1/admin/payments")
          .then((response) => {
            setPayments(response.data.payments);
          });
      } catch (error) {
        console.log("Error Fetching Payments: ", error);
      }
    };

    fetchPayments();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments.filter(
    (p) =>
      p.user_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.booking_id.toString().includes(searchTerm)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <Check className="w-4 h-4 text-primary" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-destructive" />;
      case "Failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-primary/20 text-primary border border-primary/50";
      case "Pending":
        return "bg-destructive/20 text-destructive border border-destructive/50";
      case "Failed":
        return "bg-destructive/30 text-destructive border border-destructive/50";
      default:
        return "bg-muted/20 text-foreground border border-border";
    }
  };

  const columns = [
    {
      key: "bookingId",
      label: "Booking ID",
      render: (p: Payment) => (
        <span className="font-bold text-primary">#{p.booking_id}</span>
      ),
    },
    { key: "customer", label: "Customer",
       render: (p: Payment) => (
        <span>{p.user_id?.name || "Unknown"}</span>)
      },
    {
      key: "amount",
      label: "Amount",
      render: (p: Payment) => (
        <span className="font-bold text-primary">${p.amount}</span>
      ),
    },
    { key: "payment_date", label: "Date" ,
      render: (p: Payment) => (
        <span>{new Date(p.payment_date).toLocaleDateString()}</span>
      )
    },
    { key: "payment_method", label: "Method" },
    {
      key: "status",
      label: "Status",
      render: (p: Payment) => (
        <span
          className={`px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-1 w-fit ${getStatusColor(
            p.status
          )}`}
        >
          {getStatusIcon(p.status)} {p.status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest font-mono">
          PAYMENT OPERATIONS
        </h1>
        <p className="text-xs text-foreground/60 mt-1 font-mono tracking-wide">
          TRANSACTION MONITORING
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-sm bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
        />
      </div>

      <DataTable columns={columns} data={filteredPayments} />
    </div>
  );
}
