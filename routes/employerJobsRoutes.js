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

// Route to post a job (only for employers)
router.post('/createJob', verifyToken, async (req, res) => {
  const { title, description, company, location, salary, jobType, skills } = req.body;
  const firebaseUid = req.user.uid; // Get Firebase UID from token
  const employer = await User.findOne({ firebaseUid });

  try {
    // Check if the employer exists and has the 'employer' role
    const employerExists = await User.findOne({ _id: employer, role: 'employer' });
    if (!employerExists) {
      return res.status(404).json({ message: 'Employer not found or not an employer' });
    }

    // Create a new job
    const newJob = new Job({
      title,
      description,
      skills,
      company,
      location,
      salary,
      jobType,
      employer,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
});

module.exports = router;
