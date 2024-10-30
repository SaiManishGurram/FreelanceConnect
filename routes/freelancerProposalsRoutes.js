const express = require('express');
const Application = require('../models/Application');

const router = express.Router();
const mongoose = require('mongoose');
const admin = require('../services/firebaseAdmin'); // Import initialized admin SDK
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Route to apply for a job
router.post('/submitProposal', verifyToken, async (req, res) => {
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

//Route to get all the submitted proposals by the freelancer
router.get('/getSubmittedProposals', verifyToken, async (req, res) => {
    try {
      const firebaseUid = req.user.uid; // Get Firebase UID from token
  
      const freelancerId = await User.findOne({ firebaseUid });
      
      const applications = await Application.find({ freelancerId }).sort({ createdAt: -1 }).populate('jobId');
  
      if (!applications || applications.length === 0) {
        return res.status(200).json({ message: 'No proposals found for this freelancer' });
      }
  
      res.status(200).json(applications);
    } catch (error) {
      console.error('Error fetching freelancer proposals:', error);
      res.status(500).json({ message: 'Error fetching proposals', error });
    }
  });
module.exports = router;

router.delete('/deleteProposal/:id', verifyToken, async (req, res) => {  
  const firebaseUid = req.user.uid; // Get Firebase UID from token
  const freelancerId = await User.findOne({ firebaseUid });
  try {
    const deletedProposal = await Application.findByIdAndDelete(req.params.id);
    if (!deletedProposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    res.status(200).json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting proposal', error });
  }
});