// utils.js
const shortid = require('shortid'); // Install this package if you haven't

// Function to generate a unique referral code
const generateReferralCode = () => {
    return shortid.generate(); // Generates a unique short ID
};

module.exports = { generateReferralCode };