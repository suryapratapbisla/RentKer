import mongoose from "mongoose";

const {Schema, model} = mongoose;

const bookingSchema = new Schema(
  {
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
    user_name: {
      type: String,
      trim: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    vehicle_id: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      require: true,
    },
    payment_id: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Active", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true },
)

export const Booking = model('Booking', bookingSchema);