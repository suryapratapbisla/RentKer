import { Badge } from "@/components/ui/badge"



export default function RecentBookings(bookingProps: {bookings: any[]}) {
  const { bookings } = bookingProps;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-primary/20 text-primary border border-primary/50"
      case "Completed":
        return "bg-muted/30 text-foreground border border-border"
      case "Pending":
        return "bg-destructive/20 text-destructive border border-destructive/50"
      default:
        return "bg-muted/20 text-foreground border border-border"
    }
  }

  return (
    <div className="card">
      <h2 className="card-title mb-4">Recent Bookings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Customer</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Vehicle</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 text-foreground">{booking.user_name}</td>
                <td className="px-4 py-4 text-foreground">{booking.vehicle_id.name}</td>
                <td className="px-4 py-4 text-muted-foreground">{new Date(booking.start_deadline).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-primary font-semibold">{booking.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
