const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const { metricsMiddleware, metricsHandler } = require('./metrics');
const userRoutes = require('./routes/userRoutes');
const auth = require('./auth');
const { createTestUsers } = require('./utils/testUsersAutoSetup');

const app = express();
require('dotenv').config();

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
app.use(metricsMiddleware);

const mongoUri =
  process.env.MONGO_URI ||
  process.env.MONGO_CONNECTION ||
  'mongodb+srv://skill1:e46lecibokiem@users.kon9j2k.mongodb.net/?appName=Users';

mongoose
  .connect(mongoUri, {})
  .then(async () => {
    await createTestUsers();
  })
  .catch(() => process.exit(1));

app.get('/metrics', metricsHandler);
app.use(userRoutes);

const PORT = process.env.PORT || 3050;
app.listen(PORT, '0.0.0.0');
