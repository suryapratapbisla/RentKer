import { Review } from "../models/review.models.js";

const getReviews = async (req, res) => {
    
    try {
        const reviews = await Review.find().populate('user_id', 'name').populate('vehicle_id', 'name model');
        return res.status(200).json({ reviews });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }


    res.status(200).json({ message: "List of reviews" });
}


const createReview = async (req, res) => {
    try {
        const { rating, comment, date, user_id, vehicle_id } = req.body;

        const newReview = new Review({
            rating,
            comment,
            date: date || new Date(),
            user_id,
            vehicle_id,
        });

        await newReview.save();

        return res.status(201).json({ 
            message: "Review created successfully", 
            review: newReview 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || "Could not create review" });
    }
};

export { getReviews, createReview };