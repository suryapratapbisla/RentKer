import mongoose from "mongoose"

const { Schema, model } = mongoose

const vehicleSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Booked", "Maintenance"],
        trim: true,
    },
    plate_number: {
        type: String,
        required: true,
        trim: true,
    },
    rent_price: {
        type: Number,
        required: true,
        min: 0,
    },
    media: [
        {
            type: String,
        }
    ],
    type: {
        type: String,
        required: true,
        enum: ["car", "bike", "scooter"],
        trim: true,
    },
    model: {
        type: String,
        required: true,
        trim: true,
    },
    admin_id: {
        type: Schema.Types.ObjectId,
        ref: "Admin"
    }

}, { timestamps: true })

export const Vehicle =  model('Vehicle', vehicleSchema);