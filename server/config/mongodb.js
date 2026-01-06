import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
    console.log('Database Connected!');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.log('Database Disconnected');
  });
};

export default connectDB;