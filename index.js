const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

require('dotenv').config();

// Import User Model and Utility Functions
const User = require('./models/User');
const { generateReferralCode } = require('./utils');
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'defaultsecretkey';

// Ensure Uploads Directory Exists
const uploadsDir = path.join(__dirname, 'uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Save files in 'uploads/profiles'
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.trim()}`;
        cb(null, uniqueName); // Unique filename
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept only image files
    } else {
        cb(new Error('Invalid file type. Only image files are allowed.'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads folder publicly

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Authenticate JWT Middleware
const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token missing.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Use SECRET_KEY
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        req.user = { id: user.id, role: user.role }; // Attach user to request
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

// Routes

// User Registration
app.post('/register', async (req, res) => {
    const { username, email, password, role, referralCode } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let referrerUser = null;

        if (referralCode && typeof referralCode === 'string') {
            if (role === 'admin') {
                return res.status(403).json({ success: false, message: 'Admins cannot use referral codes.' });
            }

            // Validate referral code
            referrerUser = await User.findOne({ referralCode });
            if (!referrerUser) {
                return res.status(400).json({ success: false, message: 'Invalid referral code.' });
            }

            // Award points to the referrer
            referrerUser.points = (referrerUser.points || 0) + 10000; // Add 10,000 points
            await referrerUser.save();
        }

        let generatedReferralCode = null;

        if (role === 'admin') {
            generatedReferralCode = generateReferralCode();
        }

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            referralCode: generatedReferralCode,
            referrer: referrerUser ? referralCode : null,
        });

        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully.', referralCode: generatedReferralCode });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Error during registration.', error: error.message });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('Invalid login attempt:', username);
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ success: true, message: 'Login successful.', token, user: {id: user._id,
                username: user.username,
                email: user.email,
                photoUrl: user.photo ? `http://localhost:${PORT}${user.photo}` : null, // Attach photo URL
            }
         });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json({
            success: true,
            message: 'Profile fetched successfully.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                points: user.points,
                photoUrl: user.photo ? `http://localhost:${PORT}${user.photo}` : null // Attach full photo URL
            },
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'An error occurred.', error: error.message });
    }
});

// Change Password
app.post('/profile/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ success: false, message: 'Incorrect current password.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'An error occurred.', error: error.message });
    }
});

// Upload Profile Photo
app.post('/profile/upload-photo', authenticateToken, upload.single('photo'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const photoUrl = `/uploads/profiles/${req.file.filename}`;
        user.photo = photoUrl;
        await user.save();

        res.json({
            success: true,
            message: 'Profile photo uploaded successfully.',
            photoUrl: `http://localhost:${PORT}${photoUrl}`, // Construct full URL
        });
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ success: false, message: 'An error occurred.', error: error.message });
    }
});

// Protected Admin Route
app.get('/admin', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.sendStatus(403); // Forbidden
    }
    res.json({ success: true, message: 'Welcome to the admin area.' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});