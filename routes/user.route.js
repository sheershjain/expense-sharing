const { Router } = require("express");

const userController = require("../controllers/user.controller");
const genericResponse = require("../helper/generic-response.helper");
const userValidator = require("../validators/user.validator");
const { checkAccessToken, checkRefreshToken } = require("../middlewares/auth");

const router = Router();

router.post(
  "/signup",
  userValidator.signupSchema,
  userController.userSignup,
  genericResponse.sendResponse
);

router.post(
  "/login",
  userValidator.loginSchema,
  userController.userLogin,
  genericResponse.sendResponse
);

router.get(
  "/refresh-token",
  checkRefreshToken,
  userController.refreshToken,
  genericResponse.sendResponse
);

router.post(
  "/forget-password",
  userValidator.forgetPassword,
  userController.forgetPassword,
  genericResponse.sendResponse
);

router.post(
  "/reset-password/:token",
  userValidator.resetPasswordSchema,
  userController.resetPassword,
  genericResponse.sendResponse
);

router.patch(
  "/",
  checkAccessToken,
  userValidator.userUpdateSchema,
  userController.updateUser,
  genericResponse.sendResponse
);

router.delete(
  "/",
  checkAccessToken,
  userController.deleteUser,
  genericResponse.sendResponse
);

router.post(
  "/logout",
  checkAccessToken,
  userController.userLogout,
  genericResponse.sendResponse
);

module.exports = router;
