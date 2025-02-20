import { config } from "dotenv";

config({
	path: `.env.${process.env.NODE_ENV || "test"}.local`,
});

export const { PORT, DB_URL, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN } =
	process.env;
