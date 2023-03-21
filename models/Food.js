const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.SchemaTypes.Mixed,
      required: [true, "Donation is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    postcode: {
      type: Number,
      required: [true, "Postcode is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    geoLocation: {
      type: mongoose.SchemaTypes.Mixed,
      required: [true, "Geolocation is required"],
    },
    statusAvailability: {
      type: mongoose.SchemaTypes.Mixed,
      required: [true, "StatusAvailability is required"],
    },
    items: {
      type: mongoose.SchemaTypes.Mixed,
      required: [true, "Items are required"]
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Food", FoodSchema);
