import { Router } from "express";   
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, getAvailableVehicle, getNumberOfVehicles } from "../controller/vehicle.controller.js";
import { getTotalUsers, getUsers } from "../controller/user.controller.js";
import { getPayments, getPendingPayments, getTotalRevenue } from "../controller/payment.controller.js";
import { createBooking, getActiveBookings, getBookings, getNumberOfBookings, getRecentBookings, updateBooking } from "../controller/booking.controller.js";
import { getReviews } from "../controller/review.controller.js";
import { get } from "mongoose";


const router = Router();


// DASHBOARD ROUTE
router.route('/')


// To Get the vehicle data and upadte it
router.route('/vehicles').get(getVehicles);
router.route('/vehicle/update/:id').put(updateVehicle);
router.route('/vehicle/delete/:id').delete(deleteVehicle);
router.route('/vehicle/create').post(createVehicle);
router.route('/vehicle/available').get(getAvailableVehicle);
router.route('/vehicles/total').get(getNumberOfVehicles);

// TO FETCH USER DATA
router.route('/users').get(getUsers);
router.route('/users/total').get(getTotalUsers);

// PAYMENTS
router.route('/payments/total-revenue').get(getTotalRevenue);
router.route('/payments/pending').get(getPendingPayments);
router.route('/payments').get(getPayments);


// BOOKING ROUTES
router.route('/bookings').get(getBookings);
router.route('/bookings/create').post(createBooking);
router.route('/bookings/update/:bookingId').put(updateBooking);
router.route('/bookings/active').get(getActiveBookings);
router.route('/bookings/recent').get(getRecentBookings);
router.route('/bookings/total').get(getNumberOfBookings);

// REVIEW ROUTES
router.route('/reviews').get(getReviews);


export default router;