// routes/referralRoutes.js
const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { authenticateUser  } = require('../middleware/authMiddleware'); // Middleware to authenticate users

// Route to generate a referral link
router.get('/link', authenticateUser , referralController.generateReferralLink);

// Route to track a referral
router.post('/track', authenticateUser , referralController.trackReferral);

// Route to get referral statistics
router.get('/stats', authenticateUser , referralController.getReferralStats);

module.exports = router;