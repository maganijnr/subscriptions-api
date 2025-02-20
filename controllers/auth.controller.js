import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
	//If there is something wrong with the request body, This stops the operation and moves on to the next middleware.
	//Database operations that update the state are atomic. Update either works completely or not at all. Insert either works completely or not at all. You never get half an operation.
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		//Logic to create a new user
		const { name, email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			const error = new Error("Email already exists.");
			error.statusCode = 409;
			throw error;
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUsers = await User.create(
			[
				{
					name,
					email,
					password: hashedPassword,
				},
			],
			{ session }
		);

		const token = jwt.sign(
			{
				userId: newUsers[0]._id,
			},
			JWT_SECRET,
			{
				expiresIn: JWT_EXPIRES_IN,
			}
		);

		//Commit to the session
		await session.commitTransaction();
		res.status(201).json({
			success: true,
			message: "User created successfully.",
			data: {
				user: newUsers[0],
				token,
			},
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};

export const signIn = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { email, password } = req.body;

		const userExist = await User.findOne({ email });

		if (!userExist) {
			const error = new Error("User does not exist.");
			error.statusCode = 404;
			throw error;
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			userExist.password
		);

		if (!isPasswordCorrect) {
			const error = new Error("Invalid password.");
			error.statusCode = 401;
			throw error;
		}

		const token = jwt.sign(
			{
				userId: userExist._id,
			},
			JWT_SECRET,
			{
				expiresIn: JWT_EXPIRES_IN,
			}
		);

		await session.commitTransaction();
		res.status(201).json({
			success: true,
			message: "User authenticated successfully.",
			data: {
				user: userExist,
				token,
			},
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};

export const signOut = async (req, res, next) => {};
