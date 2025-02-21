// // controllers/registerController.js
// const User = require('../models/User');
// const bcrypt = require('bcrypt');
//
// exports.register = async (req, res) => {
//     const { username, email, password, role } = req.body || {};
//
//     // Debugging log: Log incoming request body
//     console.log("Incoming request body:", req.body);
//
//     // Check for missing fields
//     if (!username || !email || !password || !role) {
//         console.error('Missing required fields:', { username, email, password, role });
//         return res.status(400).json({
//             success: false,
//             message: 'Username, email, password, and role are required.',
//         });
//     }
//
//     // Debugging log: Check email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         console.error('Invalid email format:', email);
//         return res.status(400).json({ success: false, message: "Invalid email format." });
//     }
//
//     try {
//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             console.warn('User already exists:', { email });
//             return res.status(400).json({
//                 success: false,
//                 message: 'User already exists.',
//             });
//         }
//
//         // Debugging log: Proceeding with password hashing
//         console.log('Hashing password for user:', { username, email });
//
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);
//
//         // Debugging log: Successfully hashed password
//         console.log('Password hashing successful.');
//
//         // Create a new user
//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//             role,
//         });
//
//         // Debugging log: New user object before saving
//         console.log('Attempting to save new user:', newUser);
//
//         // Save the new user to the database
//         await newUser.save();
//
//         // Debugging log: User saved successfully
//         console.log('User saved successfully:', { id: newUser._id, username: newUser.username });
//
//         return res.status(201).json({
//             success: true,
//             message: 'User registered successfully',
//             user: {
//                 id: newUser._id,
//                 username: newUser.username,
//                 email: newUser.email,
//                 role: newUser.role,
//             },
//         });
//     } catch (error) {
//         // Debugging log: Log full error details for debugging purposes
//         console.error("Error registering user:", error);
//
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };