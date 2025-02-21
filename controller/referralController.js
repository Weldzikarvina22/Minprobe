// controllers/referralController.js
const Referral = require('../models/Referral');
const User = require('../models/User');
const Notification = require('../notifications/UserNotification');

// Generate a unique referral link
exports.generateReferralLink = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        const referralLink = `${process.env.APP_URL}/register?ref=${user.referral_code}`;
        res.status(200).json({ referralLink });
    } catch (error) {
        console.error("Error generating referral link:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Track a referral
exports.trackReferral = async (req, res) => {
    const { referralCode } = req.body;

    try {
        const referrer = await User.findOne({ referral_code: referralCode });
        if (!referrer) {
            return res.status(404).json({ message: 'Referrer not found' });
        }

        // Update the referrer with the new referral
        referrer.total_referred_users += 1;
        await referrer.save();

        // Notify the referrer
        Notification.send(referrer.email, new UserNotification(referrer));

        res.status(200).json({ message: 'Referral tracked successfully' });
    } catch (error) {
        console.error("Error tracking referral:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get referral statistics
exports.getReferralStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('referrals');
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.status(200).json({
            totalReferrals: user.referrals.length,
            referralDetails: user.referrals,
        });
    } catch (error) {
        console.error("Error fetching referral stats:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};