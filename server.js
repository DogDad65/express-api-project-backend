// server.js
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Import routers for different resources
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const pinstasRouter = require("./controllers/pinstas");
const verifyToken = require("./middleware/verify-token");


app.use(cors());
app.use(express.json());

// Routes without authentication
app.use("/users", usersRouter);

// Protected routes
app.use("/profiles", verifyToken, profilesRouter);
app.use("/pinstas", verifyToken, pinstasRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Start the server
app.listen(3000, () => {
    console.log('The express app is ready!');
});
