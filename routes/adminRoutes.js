// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authMiddleware'); // Middleware to authenticate admin users

// Route to get all users
router.get('/users', authenticateAdmin, adminController.getAllUsers);

// Route to get a user by ID
router.get('/users/:id', authenticateAdmin, adminController.getUserById);

// Route to update a user
router.put('/users/:id', authenticateAdmin, adminController.updateUser );

// Route to delete a user
router.delete('/users/:id', authenticateAdmin, adminController.deleteUser );

// Route to get referral statistics
router.get('/referral-stats', authenticateAdmin, adminController.getReferralStats);

module.exports = router;