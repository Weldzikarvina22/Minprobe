// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['customer', 'event organizer'] },
    referralCode: { type: String, unique: true }, // Unique referral code for the user
    referrer: { type: String, default: null }, // Username of the referrer
    points: { type: Number, default: 0 }, // Points earned by the user
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
module.exports = User;