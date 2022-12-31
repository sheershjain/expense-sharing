const Joi = require("joi");

const { validateRequest } = require("../helper/common-functions.helper");

const createGroupSchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    category: Joi.string().valid("trip", "home", "couple", "other").required(),
  });
  validateRequest(req, res, next, schema, "body");
};

module.exports = {
  createGroupSchema,
};
