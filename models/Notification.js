// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model
        required: true,
    },
    message: {
        type: String,
        required: true, // The content of the notification
    },
    read: {
        type: Boolean,
        default: false, // Indicates whether the notification has been read
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;