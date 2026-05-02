require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    await User.create({
      username: 'admin',
      password: 'admin123',
      fullName: 'أحمد المدير',
      email: 'admin@company.com',
      role: 'admin'
    });
    console.log('Admin user created');
  }
  await mongoose.disconnect();
};

seed();