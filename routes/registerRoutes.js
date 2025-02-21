// const express = require('express');
// const router = express.Router();
// const bodyParser = require('body-parser');
// const User = require('./models/User'); // Update with your correct path to the User model
//
// // Use bodyParser middleware
// router.use(bodyParser.json());
//
// router.post('/register', async (req, res) => {
//     try {
//         // Validate and log the request body
//         console.log('Request Body: ', req.body);
//
//         // Destructure the required fields
//         const { username, email, password, role, referralCode, referrer } = req.body;
//
//         // Ensure all required fields are present
//         if (!email || !username || !password || !role) {
//             return res.status(400).json({ success: false, message: 'Missing required fields' });
//         }
//
//         // Create and save the new user
//         const newUser = new User({
//             username,
//             email,
//             password,
//             role,
//             referralCode,
//             referrer,
//         });
//
//         await newUser.save();
//
//         res.json({ success: true, message: 'User registered successfully!' });
//     } catch (error) {
//         console.error(error); // Debugging logs
//         res.status(500).json({
//             success: false,
//             message: `Error registering user: ${error.message}`,
//         });
//     }
// });
//
// module.exports = router;