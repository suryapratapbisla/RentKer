import {Booking} from "../models/booking.models.js";
import { Vehicle } from "../models/vehicle.models.js";

const getBookings = async (req, res) => {

    try {

        const bookings = await Booking.find()
            .populate('vehicle_id', 'name type rent_price status')
            .populate('user_id', 'name email');
        
        // console.log(bookings);
        

        return res.status(200).json({bookings});

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ message: error.message });
    }

}


const createBooking = async (req, res) => {

    try {

        const { start_deadline, end_deadline, total_amount, user_name, user_id, vehicle_id, status } = req.body;
        
        if (status == "Confirmed" || status == "Active") {
            await Vehicle.findOneAndUpdate({ _id: vehicle_id }, {status: "Booked"});
        }
        
        
        const newBooking = new Booking({
            start_deadline,
            end_deadline,
            total_amount,
            user_name,
            user_id,
            vehicle_id,
            status
        });

        await newBooking.save();

        return res.status(201).json({ message: "Booking created successfully", booking: newBooking });

    } catch (error) {

        console.log(error);
        

        return res.status(500).json({ message: error.message });
    }

}

const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const { start_deadline, end_deadline, total_amount, user_name, user_id, vehicle_id, status } = req.body;

        booking.start_deadline = start_deadline || booking.start_deadline;
        booking.end_deadline = end_deadline || booking.end_deadline;
        booking.total_amount = total_amount || booking.total_amount;
        booking.user_name = user_name || booking.user_name;
        booking.vehicle_id = vehicle_id || booking.vehicle_id;
        booking.user_id = user_id || booking.user_id;
        booking.status = status || booking.status;

        if (status == "Confirmed" || status == "Active") {
            await Vehicle.findOneAndUpdate({ _id: booking.vehicle_id }, { status: "Booked" });
        }

        await booking.save();

        return res.status(200).json({ message: "Booking updated successfully", booking });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getActiveBookings = async (req, res) => {
    try {
        const activeBookings = await Booking.find({ status: { $in: ["Active", "Confirmed"] } }).countDocuments();
        return res.status(200).json({total: activeBookings});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getRecentBookings = async (req, res) => {
    try {
        const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).populate('vehicle_id', 'name');
        return res.status(200).json({bookings: recentBookings});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getNumberOfBookings = async (req, res) => {
    try {
        const totalBookings = await Booking.find().countDocuments();
        return res.status(200).json({total: totalBookings});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { getBookings, createBooking, updateBooking, getActiveBookings, getRecentBookings, getNumberOfBookings };