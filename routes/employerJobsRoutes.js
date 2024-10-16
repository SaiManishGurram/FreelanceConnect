const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Job = require('../models/Job'); // Assuming Job model is already created
const admin = require('../services/firebaseAdmin');
const User = require('../models/User');

const { verifyToken } = require('../middleware/authMiddleware');

// @route GET /api/employer/jobs
// @desc Get list of jobs posted by the employer
// @access Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid; // Get Firebase UID from token

    const employerId = await User.findOne({ firebaseUid });
    
    // Fetch all jobs posted by the employer from the database
    const jobs = await Job.find({ employer: employerId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found for this employer' });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
});

module.exports = router;
