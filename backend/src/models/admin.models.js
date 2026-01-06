import mongoose, { model, Schema } from "mongoose";

const adminSchema = new Schema({
    username: {
        type: String,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
        trim: true,
    }

},{ timestamps: true })

export const Admin = model('Admin', adminSchema)