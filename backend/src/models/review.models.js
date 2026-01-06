import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        require: true,
    },
    comment: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        require: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    vehicle_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        require: true,
    },
},{ timestamps: true })

export const Review = model('Review', reviewSchema);