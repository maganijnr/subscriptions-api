import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
	res.status(200).json({ message: "User list retrieved successfully" });
});

export default userRouter;
