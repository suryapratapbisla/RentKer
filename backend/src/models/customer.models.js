import mongoose from "mongoose";

const {Schema, model} = mongoose;

const customerSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
      trim: true,
    },
    driving_license_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    driving_license_photo: {
      type: String, // URL (S3 / Cloudinary / local)
    },
    is_blacklisted: {
      type: Boolean,
      default: fasle
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true },
)


export const Customer = model('Customer', customerSchema);


