const Joi = require("joi");

const { validateRequest } = require("../helper/common-functions.helper");

const addFriendSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

module.exports = {
  addFriendSchema,
};
