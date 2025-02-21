// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateUser  } = require('../middleware/authMiddleware'); // Middleware to authenticate users

// Route to create a new notification
router.post('/', authenticateUser , notificationController.createNotification);

// Route to get all notifications for a user
router.get('/', authenticateUser , notificationController.getUserNotifications);

// Route to mark a notification as read
router.put('/:id/read', authenticateUser , notificationController.markAsRead);

// Route to delete a notification
router.delete('/:id', authenticateUser , notificationController.deleteNotification);

module.exports = router;