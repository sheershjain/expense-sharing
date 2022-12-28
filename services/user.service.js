const bcrypt = require("bcrypt");

const models = require("../models");

const userSignup = async (payload) => {
  payload.password = await bcrypt.hash(payload.password, 10);

  const existingUser = await models.User.findOne({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await models.User.create(payload);

  return user;
};

module.exports = {
  userSignup,
};
