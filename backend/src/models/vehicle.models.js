const { Schema, model } = mongoose

const vehicleSchema = new Schema({
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: "Owner"
    },
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
    plate_number: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    rent_half_day: {
        type: Number,
        required: true,
        min: 0,
    },
    rent_per_day: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        required: true,
        enum: ["AVAILABLE", "ON_RENT", "MAINTENANCE"],
        trim: true,
    },
    media: [
        {
            type: String,
        }
    ],
    type: {
        type: String,
        required: true,
        enum: ["CAR", "BIKE", "SCOOTER"],
        trim: true,
    },

}, { timestamps: true })

export const Vehicle =  model('Vehicle', vehicleSchema);