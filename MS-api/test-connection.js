require('dotenv').config();
const mongoose = require('mongoose');

const options = {
  family: 4, // إجبار IPv4
};

console.log('Connecting to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, options)
  .then(() => console.log('✅ Connected successfully'))
  .catch(err => console.error('❌ Connection failed:', err.message));