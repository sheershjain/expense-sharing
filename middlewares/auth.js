const jwt = require("jsonwebtoken");

const models = require("../models");

const checkAccessToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const accessToken = header ? header.split(" ")[1] : null;
    if (!accessToken) {
      throw new Error("Access denied");
    }
    const decodedJwt = jwt.verify(accessToken, process.env.SECRET_KEY_ACCESS);
    const user = await models.User.findOne({
      where: {
        id: decodedJwt.userId,
      },
    });
    if (!user) {
      throw new Error("User Not found");
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkAccessToken,
};
