import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "User name is required."],
			minlength: 3,
			maxlength: 50,
		},
		email: {
			type: String,
			required: [true, "User email is required."],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/\S+@\S+\.\S+/, "Invalid email format."],
		},
		password: {
			type: String,
			required: [true, "User password is required."],
			minlength: 8,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
