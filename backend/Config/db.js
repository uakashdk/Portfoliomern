import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.URL);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDB connection: ${error.message}`);
    process.exit(1);
  }
};

export default ConnectDB;
