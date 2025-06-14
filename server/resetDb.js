const mongoose = require('mongoose');

async function resetDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/DevConnect');
    console.log('Connected to MongoDB');

    // Drop the database
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully');

    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');

    console.log('Database reset complete. You can now restart your server.');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase(); 