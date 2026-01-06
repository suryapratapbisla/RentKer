"use client"

import { useEffect, useState } from "react"
import { Search, Mail, Phone } from 'lucide-react'
import DataTable from "@/components/data-table"
import axios from "axios";

interface User {
  _id: string
  name: string
  email: string
  phone: string
  createdAt: string
  bookings: number
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])


  useEffect(()=>{
    const fetchUsers = async () => {
      try {
        await axios.get('http://localhost:5000/api/v1/admin/users').then((res)=>{
          setUsers(res.data.users || [])
        });
      } catch (error) {
        console.log(error);
      }
    }
    
    fetchUsers();
  }, [])


  


  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "email",
      label: "Email",
      render: (u: User) => (
        <span className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          {u.email}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (u: User) => (
        <span className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {u.phone}
        </span>
      ),
    },
    { key: "joinDate", label: "Join Date",
      render: (u: User) => <span>{new Date(u.createdAt).toLocaleDateString()}</span>

     },
    {
      key: "bookings",
      label: "Bookings",
      render: (u: User) => <span className="font-bold text-primary">{u.bookings || 0}</span>,
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest font-mono">USER MANAGEMENT</h1>
        <p className="text-xs text-foreground/60 mt-1 font-mono tracking-wide">CUSTOMER ACCOUNT REGISTRY</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-sm bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
        />
      </div>

      <DataTable columns={columns} data={filteredUsers} />
    </div>
  )
}
