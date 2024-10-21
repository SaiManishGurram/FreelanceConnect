// routes/jobRoutes.js

const express = require('express');
const Job = require('../models/Job'); // Import the Job model
const User = require('../models/User');
const router = express.Router();
const mongoose = require('mongoose');
const admin = require('../services/firebaseAdmin'); // Import initialized admin SDK
const { verifyToken } = require('../middleware/authMiddleware');


// Middleware to authenticate user (you can customize this as per your authentication setup)
const authenticateUser = (req, res, next) => {
  const { user } = req; // Assuming user is attached to request after Firebase Auth
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  next();
};

// Route to post a job (only for employers)
router.post('/', verifyToken, async (req, res) => {
  const { title, description, company, location, salary, jobType } = req.body;
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

// Get all jobs
router.get('/', verifyToken, async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
});

// Get a specific job by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error });
  }
});

// Update a job
router.put('/:id', verifyToken, async (req, res) => {
  const { employer } = req.body;

  try {

    // Check if the employer exists and has the 'employer' role
    const employerExists = await User.findOne({ _id: employer, role: 'employer' });
    if (!employerExists) {
      return res.status(404).json({ message: 'Employer not found or not an employer' });
    }
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
  }
});


module.exports = router;
