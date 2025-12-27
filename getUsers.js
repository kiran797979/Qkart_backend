// Quick script to fetch user ID from DB
const mongoose = require('mongoose');
const { User } = require('./src/models/user.model');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/qkart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  const users = await User.find({}, { _id: 1, email: 1, name: 1 });
  console.log('\nUsers found:');
  users.forEach(user => {
    console.log(`ID: ${user._id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log('---');
  });
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
