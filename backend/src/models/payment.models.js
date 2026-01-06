import mongoose from "mongoose";

const { Schema, model } = mongoose;

const paymentSchema = new Schema({

    amount: {
        type: Number,
        require: true,
    },
    amount_paid: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        require: true,
        enum: ["pending", "paid", "failed"],
    },
    booking_id: { 
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        require: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    payment_method: {
        type: String,
        require: true,
        enum: ["credit_card", "debit_card", "bank_transfer", "paypal"],
    },
    payment_date: {
        type: Date,
        require: true,
    },
},{ timestamps: true })

export const Payment = model('Payment', paymentSchema);