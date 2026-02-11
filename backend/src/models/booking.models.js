import mongoose from "mongoose";

const {Schema, model} = mongoose;

const bookingSchema = new Schema(
  {
    vehicle_id: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      require: true,
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    start_deadline: {
      type: Date,
      require: true,
    },
    end_deadline: {
      type: Date,
      require: true,
    },
    total_amount: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      enum: ["CREATED","ACTIVE","CANCELLED","COMPLETED"],
      default: "CREATED",
    },
  },
  { timestamps: true },
)

export const Booking = model('Booking', bookingSchema);