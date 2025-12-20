import mongoose from 'mongoose'


const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
    console.log('Database Connected!');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
  }

  mongoose.connection.on('disconnected', () => {
    console.log('Database Disconnected');
  });
};


export default connectDB;