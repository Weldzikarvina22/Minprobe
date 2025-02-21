// models/Referral.js
const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model (the person who referred)
        required: true,
    },
    referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model (the person who was referred)
},
referralCode: {
    type: String,
        required: true,
        unique: true, // Ensure referral codes are unique
},
status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], // Possible statuses for the referral
default: 'pending', // Default status
},
createdAt: {
    type: Date,
default: Date.now, // Automatically set the creation date
},
});

// Create the Referral model
const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;