import mongoose from "mongoose";

const { Schema, model } = mongoose;

const paymentSchema = new Schema({
    booking_id: { 
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        require: true,
        index: true,
    },
    amount: {
        type: Number,
        require: true,
        min: 0,
    },
    type: {
        type: Number,
        require: true,
        enum: ["ADVANCE", "FINAL", "PENALTY"],
    },
    method: {
        type: String,
        enum: ["CASH","UPI", "OTHER"],
    },
    note: {
      type: String,
      trim: true,
    },
},{ timestamps: true })

export const Payment = model('Payment', paymentSchema);