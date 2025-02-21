// routes/passwordResetRoutes.js
const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

// Route to request a password reset
router.post('/request', passwordResetController.requestPasswordReset);

// Route to reset the password
router.post('/reset', passwordResetController.resetPassword);

module.exports = router;