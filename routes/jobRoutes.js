// routes/jobRoutes.js

const express = require('express');
const Job = require('../models/Job'); // Import the Job model
const User = require('../models/User'); 
const router = express.Router();
const mongoose = require('mongoose');


// Middleware to authenticate user (you can customize this as per your authentication setup)
const authenticateUser = (req, res, next) => {
    const { user } = req; // Assuming user is attached to request after Firebase Auth
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
};

// Route to post a job (only for employers)
router.post('/', async (req, res) => {
    const { title, description, company, location, salary, jobType, employer } = req.body;

    // Ensure employer is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(employer)) {
        return res.status(400).json({ message: 'Invalid employer ID format' });
    }

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
            employer: new mongoose.Types.ObjectId(employer), // Convert employer to ObjectId
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: 'Error creating job', error: error.message });
    }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
});

// Get a specific job by ID
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
});

module.exports = router;
