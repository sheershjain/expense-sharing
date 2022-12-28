const { commonErrorHandler } = require("../helper/error-handler.helper");
const userService = require("../services/user.service");

const userSignup = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.userSignup(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.userLogin(payload);
    res.data = data;
    next();
  } catch (error) {
    console.log(error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { userId: userId, token: refreshToken } = req.body;

    const data = await userService.refreshToken(refreshToken, userId);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  userSignup,
  userLogin,
  refreshToken,
};
