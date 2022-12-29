const { Op } = require("sequelize");

const models = require("../models");

const addFriend = async (payload, userData) => {
  let friendOneId = userData.id;
  let friendTwoEmail = payload.email;

  let friendTwo = await models.User.findOne({
    where: { email: friendTwoEmail },
  });
  if (!friendTwo) throw new Error("User Not Found!");
  let friendTwoId = friendTwo.dataValues.id;

  let existingRelation = await models.FriendList.findOne({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ friendOne: friendOneId }, { friendTwo: friendTwoId }],
        },
        {
          [Op.and]: [{ friendOne: friendTwoId }, { friendTwo: friendOneId }],
        },
      ],
    },
  });

  if (existingRelation) throw new Error("Relation already exist");

  let createRelation = await models.FriendList.create({
    friendOne: friendOneId,
    friendTwo: friendTwoId,
  });

  return createRelation;
};

module.exports = {
  addFriend,
};
