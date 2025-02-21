// models/Points.js
const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model
        required: true,
    },
    points: {
        type: Number,
        required: true, // The amount of points
        default: 0, // Default to 0 points
    },
    reason: {
        type: String,
        required: true, // Reason for earning or spending points
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    expiresAt: {
        type: Date, // Expiration date for the points
    },
});

// Method to check if points are expired
pointsSchema.methods.isExpired = function() {
    if (!this.expiresAt) return false; // If no expiration date, points are not expired
    return this.expiresAt < new Date(); // Check if the current date is past the expiration date
};

// Create the Points model
const Points = mongoose.model('Points', pointsSchema);

module.exports = Points;