import { Vehicle } from "../models/vehicle.models.js";

const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        return res
              .status(200)
              .json({vehicles})
    } catch (error) {
        return res
              .status(500)
              .json({message: error.message || "Could not get vehicles"})
    }
}


const createVehicle = async (req, res) => {
    try {
        const { name,brand, model, type, plate_number, status, rent_price } = req.body;
        const vehicle = await Vehicle.create({ name,brand, model, type, plate_number, status, rent_price });
        return res
              .status(201)
              .json({vehicle})
    } catch (error) {
        console.log(error);
        return res
              .status(500)
              .json({message: error.message || "Could not create vehicle"})
    }
}

const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findById(id);
        return res
              .status(200)
              .json({vehicle})
    } catch (error) {
        return res
              .status(500)
              .json({message: error.message || "Could not get vehicle by id"})
    }
}

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, brand, status, model, rent_price, media, type, plate_number, } = req.body;
        const vehicle = await Vehicle.findByIdAndUpdate(id, { name,brand, model, type, plate_number, status, rent_price }, { new: true });
        return res
              .status(200)  
              .json({message: "Vehicle updated successfully", vehicle})
    } catch (error) {
        return res
              .status(500)
              .json({message: error.message || "Could not update vehicle"})
    }
}

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        await Vehicle.findByIdAndDelete(id);
        return res
              .status(200)
              .json({message: "Vehicle deleted successfully"})
    } catch (error) {
        console.log(error);
        
        return res
              .status(500)
              .json({message: error.message || "Could not delete vehicle"})
    }
}

const getAvailableVehicle = async (req, res) => {
    
    try {
        const vehicles = await Vehicle.find({ status: "Available" });
        return res
              .status(200)
              .json({vehicles})
    } catch (error) {
        return res
              .status(500)
              .json({message: error.message || "Could not get available vehicles"})
    }
}

const getNumberOfVehicles = async (req, res) => {
    try {
        const count = await Vehicle.countDocuments();
        return res
              .status(200)
              .json({total: count});
    } catch (error) {
        return res
              .status(500)
              .json({message: error.message || "Could not get number of vehicles"});
    }
}

export {
    getVehicles,
    createVehicle,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getAvailableVehicle,
    getNumberOfVehicles
}