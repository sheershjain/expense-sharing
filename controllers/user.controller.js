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

module.exports = {
  userSignup,
};
