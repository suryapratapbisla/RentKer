"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import VehicleModal from "@/components/modals/vehicle-modal";
import DataTable from "@/components/data-table";
import axios from "axios";
import { Vehicle } from "@/types/vehicle";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Fetch vehicles from API or use mock data
    const fetchVehicles = async () => {
      try {
        await axios.get("http://localhost:5000/api/v1/admin/vehicles").then((res) => {
          setVehicles(res.data.vehicles || []);
        })
      } catch (err) {
        console.log(err);
      }
    }

    fetchVehicles();
  }, []);

  

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.plate_number ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleAddVehicle = (data: any) => {

    // Find the vehicle in the list
    const vehicle = vehicles.find((v) => v._id === selectedVehicle?._id);
    
    // If the vehicle is already in the list, update it
    if (vehicle) {
      console.log("Hello");
      axios.put(`http://localhost:5000/api/v1/admin/vehicle/update/${vehicle._id}`, data).then((res) => {  
        setVehicles(vehicles.map((v) => v._id === vehicle._id ? res.data.vehicle : v));
      }).catch((err) => {
        console.log(err);
      });
    } else {
      // If the vehicle is not in the list, add it
      axios.post("http://localhost:5000/api/v1/admin/vehicle/create", data).then((res) => {
        setVehicles([...vehicles, res.data.vehicle]);
      }).catch((err) => {
        console.log(err);
      });
    }
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = (id: string) => {

    axios.delete(`http://localhost:5000/api/v1/admin/vehicle/delete/${id}`).then(()=>{
      setVehicles(vehicles.filter((v) => v._id !== id));
    }).catch((err)=>{
      console.log(err);
    });
    
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: "media",
      label: "Media",
      render: (v: Vehicle) => {
        const primaryMedia = Array.isArray(v.media) ? v.media[0] : v.media;
        return (
          <span>
            {primaryMedia ? (
              <img
                src={primaryMedia}
                alt={v.name}
                width={50}
                height={50}
                className="object-cover"
              />
            ) : (
              "—"
            )}
          </span>
        );
      },
    },
    { key: "name", label: "Vehicle Name" },
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "type", label: "Type" },
    { key: "plate_number", label: "Plate Number" },
    {
      key: "status",
      label: "Status",
      render: (v: Vehicle) => (
        <span
          className={`px-2 py-1 rounded-sm text-xs font-bold ${
            v.status === "Available"
              ? "bg-primary/20 text-primary border border-primary/50"
              : v.status === "Booked"
              ? "bg-muted/30 text-foreground border border-border"
              : "bg-destructive/20 text-destructive border border-destructive/50"
          }`}
        >
          {v.status}
        </span>
      ),
    },
    {
      key: "price",
      label: "Daily Rate",
      render: (v: Vehicle) => `₹ ${v.rent_price}`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (v: Vehicle) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditVehicle(v)}
            className="p-2 hover:bg-primary/10 rounded-sm transition-colors"
          >
            <Edit2 className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={() => handleDeleteVehicle(v._id)}
            className="p-2 hover:bg-destructive/10 rounded-sm transition-colors"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest font-mono">
          VEHICLE OPERATIONS
        </h1>
        <p className="text-xs text-foreground/60 mt-1 font-mono tracking-wide">
          MANAGE FLEET INVENTORY
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-sm bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
          />
        </div>
        <Button
          onClick={() => {
            setSelectedVehicle(null);
            setIsModalOpen(true);
          }}
          className="tactical-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <DataTable columns={columns} data={filteredVehicles} />

      {isModalOpen && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVehicle(null);
          }}
          onSave={handleAddVehicle}
        />
      )}
    </div>
  );
}
