// models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true, // Ensure coupon codes are unique
    },
    discount: {
        type: Number,
        required: true, // The discount amount or percentage
    },
    expirationDate: {
        type: Date,
        required: true, // The date when the coupon expires
    },
    usageLimit: {
        type: Number,
        default: 1, // Default usage limit for the coupon
    },
    timesUsed: {
        type: Number,
        default: 0, // Track how many times the coupon has been used
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});

// Method to check if the coupon is valid
couponSchema.methods.isValid = function() {
    const now = new Date();
    return this.expirationDate > now && this.timesUsed < this.usageLimit;
};

// Create the Coupon model
const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;