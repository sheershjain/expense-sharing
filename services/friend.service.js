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

const addExpense = async (payload, userData) => {
  let { payeeId, payerId, baseAmount, splitType, payerAmount } = payload;
  let amountToPay;

  let payer = await models.User.findOne({
    where: { id: payerId },
  });
  if (!payer) throw new Error("User Not Found!");
  let payee = await models.User.findOne({
    where: { id: payeeId },
  });
  if (!payee) throw new Error("User Not Found!");

  let existingRelation = await models.FriendList.findOne({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ friendOne: payeeId }, { friendTwo: payerId }],
        },
        {
          [Op.and]: [{ friendOne: payerId }, { friendTwo: payeeId }],
        },
      ],
    },
  });
  if (!existingRelation)
    addFriend({ email: payer.dataValues.email }, { id: payee.dataValues.id });

  if (splitType === "exactly") {
    amountToPay = baseAmount;
  } else if (splitType === "equally") {
    amountToPay = baseAmount / 2;
  } else {
    amountToPay = payerAmount;
  }
  delete payload.payerAmount;
  payload.payeeId = payeeId;
  payload.amountToPay = amountToPay;
  let transaction = await models.Transaction.create(payload);
  return transaction;
};

module.exports = {
  addFriend,
  addExpense,
};
