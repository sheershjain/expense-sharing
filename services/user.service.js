const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const models = require("../models");
const redisClient = require("../helper/redis.helper");

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

const userLogin = async (payload) => {
  const { email, password } = payload;
  const user = await models.User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User Not Found!");
  }

  let key = user.dataValues.id + "-refresh-token";
  let refreshToken = await redisClient.get(key);

  if (!refreshToken) {
    const match = await bcrypt.compareSync(password, user.dataValues.password);
    if (!match) {
      throw new Error("Wrong email or password");
    }
    refreshToken = jwt.sign(
      { userId: user.dataValues.id },
      process.env.SECRET_KEY_REFRESH,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }
    );
  }

  const accessToken = jwt.sign(
    { userId: user.dataValues.id },
    process.env.SECRET_KEY_ACCESS,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    }
  );

  await redisClient.set(key, refreshToken);

  return {
    id: user.id,
    email: user.email,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const refreshToken = async (refreshToken, userId) => {
  let newAccessToken = jwt.sign(
    { userId: userId },
    process.env.SECRET_KEY_ACCESS,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    }
  );

  return {
    accessToken: newAccessToken,
    refreshToken,
  };
};

module.exports = {
  userSignup,
  userLogin,
  refreshToken,
};
