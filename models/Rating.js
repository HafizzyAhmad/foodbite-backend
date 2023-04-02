const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Image of donatino is required"],
    },
    ratorUserId: {
      type: String,
      required: [true, "Type of donation"],
    },
    ratingValue: {
      type: Number,
      required: [true, "Rating is required"],
    },
    image: {
      type: String,
    },
    feedback: {
      type: String,
      required: [true, "Feedback is required"],
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Rating", RatingSchema);
