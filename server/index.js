const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
console.log('Photo routes loaded:', typeof photoRoutes);
const cors = require('cors');
require('dotenv').config();
console.log('Mongo URI loaded:', !!process.env.MONGO_URI);
const uri = process.env.MONGO_URI;

const match = uri.match(
  /^mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@([^/]+)/
);

console.log('Mongo username:', match?.[1]);
console.log('Mongo host:', match?.[3]);
console.log('Password placeholder exists:', uri.includes('<db_password>'));

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/uploads', express.static('uploads'));
app.get('/', (req, res) => {
  res.send('Alzikrayat Server is running!');
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is working correctly'
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  dbName: 'alzikrayat'
})
.then(() => {
  console.log('MongoDB connected successfully');

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection details:', error.message);
});