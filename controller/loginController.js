// // controllers/loginController.js
// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
//
// // Environment variable for JWT secret
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//     console.error("JWT_SECRET is not defined. Please set it in your environment variables.");
//     process.exit(1); // Exit process if running without a proper secret
// }
//
// exports.login = async (req, res) => {
//     const { username, password } = req.body;
//     console.log('Request bodylogin:', req.body);
//
//
//     // Validate input
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required' });
//     }
//
//     try {
//         // Find the user by username
//         const user = await User.findOne({ username });
//         console.log('User found:', user);
//
//         if (!user) {
//             console.error(`Login failed: Username ${username} not found.`);
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }
//
//         // Compare the provided password with the stored hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             console.error(`Login failed: Incorrect password for username ${username}.`);
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }
//
//         // Generate a JWT token
//         const token = jwt.sign(
//             { id: user._id, username: user.username },
//             JWT_SECRET,
//             { expiresIn: '3h' }
//         );
//
//         // Respond with user data and token
//         res.status(200).json({
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 points: user.points, // Make sure this field exists in the User model
//             },
//             token,
//         });
//
//     } catch (error) {
//         console.error("Error during login:", error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };