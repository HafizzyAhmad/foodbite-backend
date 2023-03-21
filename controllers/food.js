// const { hash, compare } = require("bcryptjs");
// const { sign } = require("jsonwebtoken");

// const User = require("../models/User");
const Food = require("../models/Food");

exports.createFood = async (req, res, next) => {
  console.log("FoodCreate", req.body);
  const {
    donation,
    address,
    postcode,
    city,
    state,
    mobileNumber,
    geoLocation,
    statusAvailability,
    items,
  } = req.body;
  console.log("Register", req.body);
  if (
    !donation ||
    !address ||
    !postcode ||
    !city ||
    !state ||
    !mobileNumber ||
    !geoLocation ||
    !statusAvailability ||
    !items
  )
    return res.status(400).send("Please fill in all the required fields!");
  try {
    const foodObj = {
      donation,
      address,
      postcode,
      city,
      state,
      mobileNumber,
      geoLocation,
      statusAvailability,
      items,
    };
    const food = await new Food(foodObj).save();
    return res
      .status(201)
      .json({ food: { ...food._doc } });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.getFoods = async (req, res, next) => {
  console.log("req", req.food);
  try {
    const food = await Food.find();
    if (!food)
      return res.status(400).send("Food Donationas not found, Authorization denied..");
    return res.status(200).json({ ...food });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.updateFoodDonation = async (req, res, next) => {
  const { id } = req.params;
  console.log("Updating Food ID:: >>", id);
  try {
    const food = await Food.findById(id).lean();
    if (!food) return res.status(400).send("Food Donation does not exist");
    const foodObj = { ...req.body };
    const newFood = await Food.findByIdAndUpdate(
      { _id: id },
      { ...foodObj },
      { new: true }
    );
    return res.status(200).json(newFood);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error);
  }
};

exports.deleteFoodDonation = async (req, res, next) => {
  const { id } = req.params;
  console.log("Food ID::", id);
  try {
    await Food.findByIdAndDelete({ _id: id });
    return res.status(200).send("Food Donation has been deleted");
  } catch (error) {
    return res.status(500).json(error);
  }
};
