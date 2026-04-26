const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const client = require('prom-client');
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

const apiRequestsTotal = new client.Counter({
  name: 'api_requests_total',
  help: 'Total number of HTTP requests handled by the API',
  labelNames: ['method', 'status_code'],
});

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());
app.use(passport.initialize());
app.use((req, res, next) => {
  if (req.path === '/metrics') {
    return next();
  }

  res.on('finish', () => {
    apiRequestsTotal.inc({
      method: req.method,
      status_code: String(res.statusCode),
    });
  });

  next();
});

const mongoUri =
  process.env.MONGO_URI ||
  process.env.MONGO_CONNECTION ||
  'mongodb+srv://skill1:e46lecibokiem@users.kon9j2k.mongodb.net/?appName=Users';

mongoose
  .connect(mongoUri, {})
  .then(async () => {
    console.log('DB is connected');
    await createTestUsers();
  })
  .catch(err => console.log(err));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use(userRoutes);

const PORT = process.env.PORT || 3050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
