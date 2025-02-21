// controllers/profileController.js
const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;

    try {
        const updatedUser  = await User.findByIdAndUpdate(
            req.user.id,
            { username, email },
            { new: true, runValidators: true } // Return the updated document and run validators
        ).select('-password'); // Exclude password from the response

        if (!updatedUser ) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.status(200).json(updatedUser );
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};