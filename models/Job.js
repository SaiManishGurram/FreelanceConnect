// models/Job.js

const mongoose = require('mongoose');

// Define the Job schema
const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship'],
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the employer (user ID)
      ref: 'User', // Referring to the User model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Job model
const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
