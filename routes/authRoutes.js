// routes/authRoutes.js

const express = require('express');
const User = require('../models/User');  // Assuming a User model for MongoDB is already created
const router = express.Router();

// Register user in MongoDB after Firebase Auth signup
router.post('/', async (req, res) => {
    console.log('req...',req.body);
    
    const { uid, firstName, lastName, email, role } = req.body;

    try {
        // Check if user already exists in MongoDB
        const existingUser = await User.findOne({ uid });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists in MongoDB' });
        }

        // Create new user in MongoDB
        const newUser = new User({
            firebaseUid: uid,      // Firebase UID
            firstName,
            lastName,
            email,    // Firebase email
            role, // Default role as 'user', could be 'freelancer' or 'employer' based on your logic
        });

        const savedUser = await newUser.save();
        return res.status(201).json({ message: 'User registered successfully', user: savedUser });

    } catch (error) {
        console.error('Error registering user in MongoDB:', error);
        return res.status(500).json({ message: 'Error registering user in MongoDB', error: error.message });
    }
});

module.exports = router;
