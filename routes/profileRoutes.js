// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateUser  } = require('../middleware/authMiddleware'); // Middleware to authenticate users

// Route to get the user's profile
router.get('/', authenticateUser , profileController.getProfile);

// Route to update the user's profile
router.put('/', authenticateUser , profileController.updateProfile);

module.exports = router;