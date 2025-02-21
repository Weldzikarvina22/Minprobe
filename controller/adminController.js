// controllers/adminController.js
const User = require('../models/User');
const Referral = require('../models/Referral');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.getUserById = async (req, res) => { // Corrected function name
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

exports.updateUser  = async (req, res) => {
    const { id } = req.params;
    const { username, email, points } = req.body;

    try {
        const updatedUser  = await User.findByIdAndUpdate(id, { username, email, points }, { new: true });
        if (!updatedUser ) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.status(200).json(updatedUser );
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

exports.deleteUser  = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser  = await User.findByIdAndDelete(id);
        if (!deletedUser ) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.status(200).json({ message: 'User  deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

exports.getReferralStats = async (req, res) => {
    try {
        const referrals = await Referral.find();
        const totalReferrals = referrals.length;

        // You can add more statistics as needed
        res.status(200).json({ totalReferrals });
    } catch (error) {
        console.error("Error fetching referral stats:", error);
        res.status(500).json({ message: 'Error fetching referral stats' });
    }
};