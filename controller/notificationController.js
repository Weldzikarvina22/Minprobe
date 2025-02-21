// controllers/notificationController.js
const Notification = require('../models/Notification');

// Create a new notification
exports.createNotification = async (req, res) => {
    const { userId, message } = req.body;

    try {
        const notification = new Notification({
            userId,
            message,
            read: false, // Default to unread
            createdAt: new Date(),
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNotification = await Notification.findByIdAndDelete(id);
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};