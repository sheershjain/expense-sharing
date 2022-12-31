const { commonErrorHandler } = require("../helper/error-handler.helper");
const groupService = require("../services/group.service");

const createGroup = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await groupService.createGroup(payload);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await groupService.addMember(payload, req.user);
    res.data = data;
    next();
  } catch (error) {
    console.log("-----", error);
    console.log("getModalFieldData error:", error);
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  createGroup,
  addMember,
};
