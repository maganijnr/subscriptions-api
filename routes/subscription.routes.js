import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.post("/", (req, res) => {
	res.status(201).json({ message: "Subscription created successfully" });
});

export default subscriptionRouter;
