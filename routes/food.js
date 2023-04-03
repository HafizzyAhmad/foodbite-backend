const { Router } = require("express");

const isAuth = require("../middleware/is-user");
const foodController = require("../controllers/food");

const router = Router({ strict: true });

router.post("/donate", isAuth, foodController.createFood);
router.get("/donations", isAuth, foodController.getFoods);
router.get(
  "/donations/lat=:centerLat&long=:centerLong&distance=:distance",
  isAuth,
  foodController.getFoodsBySpecLocation
);
router.get("/donations/:id", isAuth, foodController.getFoodsById);
router
  .route("/donation/:id")
  .put(isAuth, foodController.updateFoodDonation)
  .delete(isAuth, foodController.deleteFoodDonation);

module.exports = router;
