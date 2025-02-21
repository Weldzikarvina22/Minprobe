// controllers/passwordResetController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

// Request a password reset
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        // Generate a password reset token
        const token = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Send password reset email
        await sendPasswordResetEmail(user.email, token);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error("Error requesting password reset:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reset the password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() } // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetToken = undefined; // Clear the reset token
        user.passwordResetExpires = undefined; // Clear the expiration
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};