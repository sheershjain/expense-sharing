const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const { validateRequest } = require("../helper/common-functions.helper");

const complexityOptions = {
  min: 4,
  max: 16,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

const signupSchema = async (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().email().lowercase().required(),
    password: passwordComplexity(complexityOptions).required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const loginSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: passwordComplexity(complexityOptions).required(),
  });

  validateRequest(req, res, next, schema, "body");
};

module.exports = {
  signupSchema,
  loginSchema,
};
