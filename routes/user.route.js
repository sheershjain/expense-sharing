const { Router } = require("express");

const controllers = require("../controllers");
const genericResponse = require("../helper/generic-response.helper");

const router = Router();

router.post(
  "/signup",
  controllers.user.userSignup,
  genericResponse.sendResponse
);

module.exports = router;
