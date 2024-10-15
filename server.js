require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const jobRoutes = require('./routes/jobRoutes'); // Adjust the path as necessary
const authRoutes = require('./routes/authRoutes'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json()); // For parsing application/json


// Middleware
app.use(bodyParser.json());
app.use(cors());


// Use job routes
app.use('/api/jobs', jobRoutes); // Prefix all job routes with /api/jobs
app.use('/api/register', authRoutes); // Prefix all job routes with /api/jobs

const connectDB = require('./config/db');
connectDB();  // Call the MongoDB connection


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
