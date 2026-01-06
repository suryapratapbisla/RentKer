import { Payment } from "../models/payment.models.js"


const getPayments = async (req,res) => {
    try {
        // console.log("Fetching Payments");
        
        const payments = await Payment.find().populate("user_id", "name");
        
        // console.log(payments);
        
        return res.status(200).json({payments})

    } catch (error) {
        return res.status(500).json({message: "Couldn't Fetch Payments"})
    }
}

const getTotalRevenue = async (req, res) => {
    try {
        const payments = await Payment.find({status: "paid"}).countDocuments();

        return res.status(200).json({total: payments})

    } catch (error) {
        return res.status(500).json({message: "Couldn't Fetch Total Revenue"})
    }
}

const getPendingPayments = async (req, res) => {
    try {
        const payments = await Payment.find({status: "pending"}).countDocuments();
        return res.status(200).json({total: payments})

    } catch (error) {
        return res.status(500).json({message: "Couldn't Fetch Pending Payments"})
    }
}   

const createPayment = async (req, res) => {
    try {
        const { amount, amount_paid, status, booking_id, user_id, payment_method, payment_date } = req.body;

        const newPayment = new Payment({
            amount,
            amount_paid,
            status,
            booking_id,
            user_id,
            payment_method,
            payment_date: payment_date || new Date(),
        });

        await newPayment.save();

        return res.status(201).json({ 
            message: "Payment created successfully", 
            payment: newPayment 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || "Could not create payment" });
    }
};

const getPaymentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const payments = await Payment.find({ user_id: userId })
            .populate({
                path: "booking_id",
                populate: { path: "vehicle_id", select: "name model type" },
            })
            .sort({ payment_date: -1 });

        return res.status(200).json({ payments });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Could not fetch payments" });
    }
};

export {getPayments, getTotalRevenue, getPendingPayments, createPayment, getPaymentsByUser}