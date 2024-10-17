const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const pinstaRouter = require('./controllers/pinstas')
const PORT = process.env.PORT ? process.env.PORT : 3000

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
// app.use(verifyToken);
app.use('/pinstas', pinstaRouter);


app.listen(PORT, () => {
    console.log('The express app is ready!');
});