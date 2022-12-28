const { Router } = require("express");

const controllers = require("../controllers");
const genericResponse = require("../helper/generic-response.helper");
const validator = require("../validators");
const { checkAccessToken, checkRefreshToken } = require("../middlewares/auth");

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

router.get(
  "/refresh-token",
  checkRefreshToken,
  controllers.user.refreshToken,
  genericResponse.sendResponse
);

router.post(
  "/forget-password",
  validator.userValidator.forgetPassword,
  controllers.user.forgetPassword,
  genericResponse.sendResponse
);

router.post(
  "/reset-password/:token",
  validator.userValidator.resetPasswordSchema,
  controllers.user.resetPassword,
  genericResponse.sendResponse
);

router.patch(
  "/",
  validator.userValidator.userUpdateSchema,
  checkAccessToken,
  controllers.user.updateUser,
  genericResponse.sendResponse
);

module.exports = router;
