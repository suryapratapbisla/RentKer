"use client";

import { createContext, useContext, useState } from "react";

const VehicleContext = createContext();

export function VehicleProvider({ children, initialData }) {
  const [vehicleData] = useState(initialData);

  return (
    <VehicleContext.Provider value={{ vehicleData }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  return useContext(VehicleContext);
}
