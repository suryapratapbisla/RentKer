import { Router } from "express";
import { createUser } from "../controller/user.controller.js";
import { createPayment, getPaymentsByUser } from "../controller/payment.controller.js";
import { createReview } from "../controller/review.controller.js";

const router = Router();

// User routes
router.route('/register').post(createUser);

// Payment routes
router.route('/payments').post(createPayment);
router.route('/payments/:userId').get(getPaymentsByUser);

// Review routes
router.route('/reviews').post(createReview);

export default router;

