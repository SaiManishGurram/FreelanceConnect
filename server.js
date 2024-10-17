require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server: SocketIOServer } = require('socket.io');

const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const applyRoutes = require('./routes/applyRoutes');
const freelancerJobsRoute = require('./routes/freelancerJobsRoutes');
const employerJobsRoute = require('./routes/employerJobsRoutes');
const Message = require('./models/Message');  
const app = express();
// Your Express routes
// app.get('/', (req, res) => {
//   res.send('Hello, this is the Express app running!');
// });

// Create a shared HTTP server
const server = createServer(app);
// Initialize Socket.IO on the same server
const io = new SocketIOServer(server, {
  transports: ['websocket'],
  path: '/socket.io/',
  cors: {
      origin: 'http://localhost:3000', // Your frontend origin
      methods: ['GET', 'POST'],
      credentials: true
  },
});



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


// Store a map of userId -> socketId
const users = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a user logs in or connects, you should send their userId (firebaseId or senderId)
  socket.on('register', (userId) => {
    users.set(userId, socket.id);  // Store the user's socket ID
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
  });

  // Handle message event
  socket.on('chat message', async ({ senderId, receiverId, content }) => {
    const newMessage = new Message({  
      sender: senderId,
      receiver: receiverId,
      content: content,
    });

    try {
      await newMessage.save(); // Save message to MongoDB
      
      // Find the socket ID of the receiver
      const receiverSocketId = users.get(receiverId);
      if (receiverSocketId) {
        // Emit the message to the specific receiver
        socket.to(receiverSocketId).emit('chat message', { sender: senderId, content: content });
      }
      
      // Optionally emit the message back to the sender to display in their chat
      socket.emit('chat message', { sender: senderId, content: content }); 

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User with socket ID ${socket.id} disconnected`);
    // Optionally, remove the user from the map
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);  // Remove the user from the map on disconnect
        break;
      }
    }
  });
});

// Start the server for both Express and Socket.IO
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});