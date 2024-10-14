require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Simple route
app.get('/', (req, res) => {
  res.send('Welcome to FreelanceConnect backend!');
});

// Use the PORT from the .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const connectDB = require('./config/db');
connectDB();  // Call the MongoDB connection
