const errorMiddleware = async (err, req, res, next) => {
	try {
		let error = { ...err };
		error.message = err.message || "An unexpected error occurred.";

		//Mongoose bad ObjectId error
		if (err.name === "CastError") {
			const message = "Resource not found.";
			error = new Error(message);
			error.statusCode = 404;
		}

		//Mongoose duplicate key error
		if (err.code === 11000) {
			const message = "Duplicate field value entered for unique field.";
			error = new Error(message);
			error.statusCode = 400;
		}

		//Mongoose Validation error
		if (error.name === "ValidationError") {
			const message = Object.values(err.errors).map((e) => e.message);
			error = new Error(message.join(", "));
			error.statusCode = 400;
		}

		res.status(error.statusCode || 500).json({
			success: false,
			error: error.message || "Internal server error.",
		});
	} catch (error) {
		next(error);
	}
};

export default errorMiddleware;
