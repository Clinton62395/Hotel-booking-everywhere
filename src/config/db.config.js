import mongoose from "mongoose";
import dotenv from "dotenv";
import { exit } from "process";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🌺connexion to mongodb succesfully 🍕");
  } catch (error) {
    console.log("❌error when connecting to mongodb", error);
    process.exit(1);
  }
};

export default connectDB;
