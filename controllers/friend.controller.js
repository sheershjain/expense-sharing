const { commonErrorHandler } = require("../helper/error-handler.helper");
const friendService = require("../services/friend.service");

const addFriend = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await friendService.addFriend(payload, req.user);
    res.data = data;
    next();
  } catch (error) {
    console.log(error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const addExpense = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await friendService.addExpense(payload, req.user);
    res.data = data;
    next();
  } catch (error) {
    console.log(error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const simplifyDebts = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await friendService.simplifyDebts(req.user, params);
    res.data = data;
    next();
  } catch (error) {
    console.log(error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const overallExpenseOfCurrentUser = async (req, res, next) => {
  try {
    const data = await friendService.overallExpenseOfCurrentUser(req.user);
    res.data = data;
    next();
  } catch (error) {
    console.log(error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const AllTransactionWithTargetUser = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await friendService.AllTransactionWithTargetUser(
      req.user,
      params
    );
    res.data = data;
    next();
  } catch (error) {
    console.log(error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const removeFriend = async (req, res, next) => {
  try {
    const { params } = req;
    const data = await friendService.removeFriend(req.user, params);
    res.data = data;
    next();
  } catch (error) {
    console.log(error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const getAllFriend = async (req, res, next) => {
  try {
    const data = await friendService.getAllFriend(req.user);
    res.data = data;
    next();
  } catch (error) {
    console.log(error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  addFriend,
  addExpense,
  simplifyDebts,
  overallExpenseOfCurrentUser,
  AllTransactionWithTargetUser,
  removeFriend,
  getAllFriend,
};
