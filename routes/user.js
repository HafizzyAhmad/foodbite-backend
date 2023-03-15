const { Router } = require("express");

const isAuth = require("../middleware/is-user");
const userController = require("../controllers/user");

const router = Router({ strict: true });

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/users", isAuth, userController.getUsers);
router
  .route("/profile/:id")
  .put(isAuth, userController.updateUserProfile)
  .delete(isAuth, userController.deleteUserProfile);

module.exports = router;
