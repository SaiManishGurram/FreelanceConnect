// routes/freelancerJobs.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Job = require('../models/Job'); // Assuming Job model is already created
const admin = require('../services/firebaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');


// Middleware to verify the user is authenticated (you can add token validation here)

// @route GET /api/freelancer/jobs
// @desc Get list of jobs for freelancers
// @access Private
router.get('/', verifyToken, async (req, res) => {
  try {
    // Fetch all available jobs from the database
    const jobs = await Job.find({});

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs available' });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
});

module.exports = router;
