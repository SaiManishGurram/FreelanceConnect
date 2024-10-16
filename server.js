require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const applyRoutes = require('./routes/applyRoutes');
const freelancerJobsRoute = require('./routes/freelancerJobsRoutes');
const employerJobsRoute = require('./routes/employerJobsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json()); // For parsing application/json


// Middleware
app.use(bodyParser.json());
app.use(cors());


// Use job routes
app.use('/api/register', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/jobs/apply', applyRoutes); 
app.use('/api/freelancer/jobs', freelancerJobsRoute);
app.use('/api/employer/jobs', employerJobsRoute);

const connectDB = require('./config/db');
connectDB();  // Call the MongoDB connection


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
