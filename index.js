// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Import User model
const User = require('./User '); // Ensure there are no trailing spaces
const { generateReferralCode } = require('./utils'); // Import the function from utils.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// User Registration
app.post('/register', async (req, res) => {
    const { username, password, role, referrer } = req.body;

    if (!username || !password || !role) {
        return res.status(400).send('Username, password, and role are required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = generateReferralCode(); // Generate a referral code
    const newUser  = new User({ username, password: hashedPassword, role, referralCode });

    try {
        // Check if the referrer exists
        if (referrer) {
            const referrerUser  = await User.findOne({ username: referrer });
            if (referrerUser ) {
                newUser .referrer = referrer; // Set the referrer
                referrerUser .points = (referrerUser .points || 0) + 10000; // Reward the referrer with points
                await referrerUser .save(); // Save the referrer user
            } else {
                return res.status(400).send('Referrer does not exist.');
            }
        }

        await newUser .save();
        res.status(201).send(`User  registered successfully with referral code: ${referralCode}`);
    } catch (error) {
        res.status(400).send('Error registering user: ' + error.message);
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials.');
    }

    const token = jwt.sign({ username: user.username, role: user.role }, process.env.SECRET_KEY);
    res.json({ token });
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected Route: Admin Area
app.get('/admin', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.sendStatus(403); // Forbidden
    }
    res.send('Welcome to the admin area.');
});

// Protected Route: Referrals
app.get('/referrals', authenticateToken, async (req, res) => {
    const referrals = await User.find({ referrer: req.user.username });
    res.json(referrals);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});