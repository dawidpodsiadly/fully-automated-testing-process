const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const auth = require('./auth');
const { createTestUsers } = require('./utils/testUsersAutoSetup');

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());
app.use(passport.initialize());

mongoose
  .connect('mongodb+srv://skill1:e46lecibokiem@users.kon9j2k.mongodb.net/?appName=Users', {})
  .then(async () => {
    console.log('DB is connected');
    await createTestUsers();
  })
  .catch(err => console.log(err));

app.use(userRoutes);

const PORT = process.env.PORT || 3050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
