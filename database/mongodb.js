import mongoose from "mongoose";
import { DB_URL, NODE_ENV } from "../config/env.js";

if (!DB_URL) {
	throw new Error("DB_URL not defined in environment variables.");
}

const connectToDatabase = async () => {
	try {
		await mongoose.connect(DB_URL);
		console.log(`Connected to MongoDB`);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
};

export default connectToDatabase;
