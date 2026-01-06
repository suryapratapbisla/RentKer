import mongoose from "mongoose";

const {Schema, model} = mongoose;

const userSchema = Schema(
  {
    clerk_id: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    driving_license_no: {
      type: String,
      trim: true,
    },
    driving_license_photo: {
      type: String,
      trim: true,
    },
    bookings: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true },
)


export const User = model('User', userSchema);


