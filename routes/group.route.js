const { Router } = require("express");

const groupController = require("../controllers/group.controller");
const groupValidator = require("../validators/group.validator");
const genericResponse = require("../helper/generic-response.helper");
const groupSerializer = require("../serializers/group.serializer");
const { checkAccessToken } = require("../middlewares/auth");

const router = Router();

router.post(
  "/",
  checkAccessToken,
  groupValidator.createGroupSchema,
  groupController.createGroup,
  groupSerializer.createGroupData,
  genericResponse.sendResponse
);

router.post(
  "/member",
  checkAccessToken,
  groupValidator.addMemberSchema,
  groupController.addMember,
  groupSerializer.addMemberData,
  genericResponse.sendResponse
);

router.post(
  "/expense",
  checkAccessToken,
  groupValidator.addExpenseSchema,
  groupController.addExpense,
  groupSerializer.addExpenseData,
  genericResponse.sendResponse
);

router.get(
  "/simplify-debt/:id",
  groupValidator.simplifyDebtsSchema,
  groupController.simplifyDebts,
  genericResponse.sendResponse
);

router.get(
  "/expense/:id",
  checkAccessToken,
  groupValidator.paramsIdCheck,
  groupController.expenseDetail,
  groupSerializer.expenseDetailData,
  genericResponse.sendResponse
);

module.exports = router;
