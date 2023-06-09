const { Router } = require("express");

const isAuth = require("../middleware/is-user");
const ratingController = require("../controllers/rating");

const router = Router({ strict: true });

router.post("/create", isAuth, ratingController.createRating);
router.get("/allRatings", isAuth, ratingController.getAllRatings);
router.get(
  "/recommendedUserByRating",
  isAuth,
  ratingController.getRecommendedUsersByRating
);
router.get(
  "/ratings/userId=:userId",
  isAuth,
  ratingController.getRatingsByUserId
);
router.get(
  "/ratingsByPost/userId=:userId",
  isAuth,
  ratingController.getRatingsByOwnerDonation
);
router.get(
  "/ratings/ratorId=:ratorId",
  isAuth,
  ratingController.getRatingsByRatorUserId
);
router
  .route("/ratings/id=:id")
  .put(isAuth, ratingController.updateRating)
  .delete(isAuth, ratingController.deleteRating);

module.exports = router;
