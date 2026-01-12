export interface Vehicle {
  _id: string
  name: string
  model: string
  type: string
  plate_number?: string
  status: "Available" | "Booked" | "Maintenance"
  rent_price?: number
  brand?: string
  media?: string[] | string
}

