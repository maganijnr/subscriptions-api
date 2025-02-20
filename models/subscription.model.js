import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Subscription name is required."],
			minlength: 3,
			maxlength: 100,
			trim: true,
		},
		price: {
			type: Number,
			required: [true, "Subscription price is required."],
			min: [0, "Subscription price must be greater than or equal to 0."],
		},
		currency: {
			type: String,
			required: [true, "Subscription currency is required."],
			enum: ["USD", "EUR", "GBP", "NGN"],
			default: "NGN",
		},
		frequency: {
			type: String,
			required: [true, "Subscription frequency is required."],
			enum: ["daily", "weekly", "monthly", "yearly"],
		},
		category: {
			type: String,
			required: [true, "Subscription category is required."],
			enum: [
				"sports",
				"news",
				"entertainment",
				"lifestyle",
				"technology",
				"politics",
				"food",
				"gym",
				"other",
			],
		},
		paymentMethod: {
			type: String,
			required: [true, "Payment method is required."],
			trim: true,
		},
		status: {
			type: String,
			required: [true, "Subscription status is required."],
			enum: ["active", "expired", "cancelled"],
			default: "active",
		},
		startDate: {
			type: Date,
			required: [true, "Subscription start date is required."],
			validate: {
				validator: function (value) {
					return value <= new Date();
				},
				message: "Subscription start date must be in the past.",
			},
		},
		renewalDate: {
			type: Date,
			validate: {
				validator: function (value) {
					return value > this.startDate;
				},
				message: "Subscription renewal date must be after the start date.",
			},
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
);

//This will be called before the document is saved
//Auto calculate the renewal date based on the frequency
subscriptionSchema.pre("save", function (next) {
	if (!this.renewalDate) {
		const renewalPeriods = {
			daily: 1,
			weekly: 7,
			monthly: 30,
			yearly: 365,
		};

		this.renewalDate = new Date(this.startDate);
		this.renewalDate.setDate(
			this.renewalDate.getDate() + renewalPeriods[this.frequency]
		);
	}

	if (this.renewalDate < new Date()) {
		this.status = "expired";
	}

	next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
