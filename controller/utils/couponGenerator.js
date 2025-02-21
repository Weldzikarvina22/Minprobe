// utils/couponGenerator.js

const crypto = require('crypto');

/**
 * Generate a unique coupon code.
 * @param {number} length - The length of the coupon code.
 * @returns {string} - A unique coupon code.
 */
const generateCouponCode = (length = 10) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
};

/**
 * Validate a coupon code.
 * @param {string} code - The coupon code to validate.
 * @param {Array} existingCodes - An array of existing coupon codes to check against.
 * @returns {boolean} - True if the code is valid (not already used), false otherwise.
 */
const validateCouponCode = (code, existingCodes) => {
    return !existingCodes.includes(code);
};

module.exports = {
    generateCouponCode,
    validateCouponCode,
};