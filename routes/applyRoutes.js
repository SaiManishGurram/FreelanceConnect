const express = require('express');
const Application = require('../models/Application');

const router = express.Router();
const mongoose = require('mongoose');
const admin = require('../services/firebaseAdmin'); // Import initialized admin SDK
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Route to apply for a job
router.post('/', verifyToken, async (req, res) => {
    const { jobId, coverLetter } = req.body;
    const firebaseUid = req.user.uid; // Get Firebase UID from token
    const freelancerId = await User.findOne({ firebaseUid });

    if (!jobId || !coverLetter) {
        return res.status(400).json({ message: 'Job ID and cover letter are required' });
    }

    try {
        const newApplication = new Application({
            jobId,
            freelancerId, // Firebase UID
            coverLetter,
        });

        const savedApplication = await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully', application: savedApplication });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting application', error });
    }
});

module.exports = router;
