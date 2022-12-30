const { Router } = require("express");

const friendController = require("../controllers/friend.controller");
const friendValidator = require("../validators/friend.validator");
const genericResponse = require("../helper/generic-response.helper");
const friendSerializer = require("../serializers/friend.serializer");
const { checkAccessToken } = require("../middlewares/auth");

const router = Router();

router.post(
  "/",
  checkAccessToken,
  friendValidator.addFriendSchema,
  friendController.addFriend,
  friendSerializer.addFriendData,
  genericResponse.sendResponse
);

router.post(
  "/expense",
  checkAccessToken,
  friendValidator.addExpenseSchema,
  friendController.addExpense,
  friendSerializer.addExpenseData,
  genericResponse.sendResponse
);

router.get(
  "/simplify-debts/:id",
  checkAccessToken,
  friendValidator.targetUserIdCheck,
  friendController.simplifyDebts,
  friendController.simplifyDebts,
  genericResponse.sendResponse
);

router.get(
  "/all",
  checkAccessToken,
  friendController.overallExpenseOfCurrentUser,
  genericResponse.sendResponse
);

router.get(
  "/transactions/:id",
  checkAccessToken,
  friendValidator.targetUserIdCheck,
  friendController.AllTransactionWithTargetUser,
  friendSerializer.AllTransactionWithTargetUserData,
  genericResponse.sendResponse
);

module.exports = router;
