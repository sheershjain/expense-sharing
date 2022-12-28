const { Router } = require("express");

const controllers = require("../controllers");
const genericResponse = require("../helper/generic-response.helper");
const validator = require("../validators");

const router = Router();

router.post(
  "/signup",
  validator.userValidator.signupSchema,
  controllers.user.userSignup,
  genericResponse.sendResponse
);

router.post(
  "/login",
  validator.userValidator.loginSchema,
  controllers.user.userLogin,
  genericResponse.sendResponse
);

module.exports = router;
