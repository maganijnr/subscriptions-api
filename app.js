import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
//Routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

const app = express();

app.use(express.json());
//Helps to process formData sent from client
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/subscriptions", subscriptionRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}!`);
	await connectToDatabase();
});
