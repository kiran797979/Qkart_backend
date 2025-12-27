// Script to seed the database with sample data
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const { User } = require('./src/models/user.model');
const { Product } = require('./src/models/product.model');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/qkart', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Drop existing collections
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Dropped existing collections');

    // Load data from JSON files (NDJSON format)
    const usersFile = fs.readFileSync(path.join(__dirname, 'data', 'export_qkart_users.json'), 'utf8');
    const productsFile = fs.readFileSync(path.join(__dirname, 'data', 'export_qkart_products.json'), 'utf8');

    // Parse NDJSON format
    const usersData = usersFile.trim().split('\n').map(line => {
      const doc = JSON.parse(line);
      // Convert MongoDB extended JSON to regular JSON
      if (doc._id && doc._id.$oid) {
        doc._id = doc._id.$oid;
      }
      if (doc.createdAt && doc.createdAt.$date) {
        doc.createdAt = new Date(doc.createdAt.$date);
      }
      if (doc.updatedAt && doc.updatedAt.$date) {
        doc.updatedAt = new Date(doc.updatedAt.$date);
      }
      return doc;
    });

    const productsData = productsFile.trim().split('\n').map(line => {
      const doc = JSON.parse(line);
      // Convert MongoDB extended JSON to regular JSON
      if (doc._id && doc._id.$oid) {
        doc._id = doc._id.$oid;
      }
      if (doc.createdAt && doc.createdAt.$date) {
        doc.createdAt = new Date(doc.createdAt.$date);
      }
      if (doc.updatedAt && doc.updatedAt.$date) {
        doc.updatedAt = new Date(doc.updatedAt.$date);
      }
      return doc;
    });

    // Insert users
    await User.insertMany(usersData);
    console.log(`Inserted ${usersData.length} users`);

    // Insert products
    await Product.insertMany(productsData);
    console.log(`Inserted ${productsData.length} products`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
