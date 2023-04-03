const Food = require("../models/Food");
const mongoose = require("mongoose");

exports.createFood = async (req, res, next) => {
  const {
    image,
    type,
    createdById,
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
  if (
    !image ||
    !type ||
    !createdById ||
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
  const id = mongoose.Types.ObjectId(createdById);
  try {
    const foodObj = {
      image,
      type,
      createdById: id,
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
    return res.status(201).json({ food: { ...food._doc } });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.getFoods = async (req, res, next) => {
  console.log("req", req.food);
  try {
    const food = await Food.find();
    if (!food)
      return res
        .status(400)
        .send("Food Donationas not found, Authorization denied..");
    console.log(
      "FoodID",
      food[0].createdById,
      typeof food[0].createdById,
      food[0].createdById
    );
    return res.status(200).json(food);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.getFoodsById = async (req, res, next) => {
  const { id } = req.params;
  console.log("FindById :: >>", id);
  try {
    const food = await Food.find({ createdById: id });
    if (!food)
      return res
        .status(400)
        .send("Food Donationas not found, Authorization denied..");
    return res.status(200).json(food);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const calcDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d * 0.001;
};

exports.getFoodsBySpecLocation = async (req, res, next) => {
  const { centerLat, centerLong, distance } = req.params;
  try {
    const food = await Food.find();
    if (!food)
      return res
        .status(400)
        .send("Food Donationas not found, Authorization denied..");
    let tempRes = food.filter(
      (item) =>
        calcDistance(
          centerLat,
          centerLong,
          item.geoLocation.latitude,
          item.geoLocation.longitude
        ) < distance
    );
    return res.status(200).json(tempRes);
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
