const { Op, Sequelize } = require("sequelize");

const { sequelize } = require("../models");
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

  if (!(payeeId === userData.id || payerId === userData.id))
    throw new Error("Access Denied!");

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
  let transaction, expense;
  const t = await sequelize.transaction();
  try {
    expense = await models.Expense.create(
      {
        name: payload.name,
        baseAmount: payload.baseAmount,
        splitType: payload.splitType,
        groupId: payload.groupId || null,
      },
      { transaction: t }
    );
    transaction = await models.Transaction.create(
      {
        expenseId: expense.dataValues.id,
        payeeId: payeeId,
        payerId: payerId,
        amountToPay: amountToPay,
      },
      { transaction: t }
    );

    await t.commit();
    return {
      expense,
      transaction,
    };
  } catch (error) {
    throw new Error("Something went wrong");
    await t.rollback();
  }
};

const simplifyDebts = async (userData, params) => {
  let targetUser = params.id;
  let currentUser = userData.id;

  let targetUserData = await models.Transaction.findAll({
    attributes: [
      [Sequelize.fn("sum", Sequelize.col("amount_to_pay")), "targetUserAmount"],
    ],
    where: {
      payeeId: currentUser,
      payerId: targetUser,
    },
  });
  let currentUserData = await models.Transaction.findAll({
    attributes: [
      [
        Sequelize.fn("sum", Sequelize.col("amount_to_pay")),
        "currentUserAmount",
      ],
    ],
    where: {
      payeeId: targetUser,
      payerId: currentUser,
    },
  });
  let amountDifference =
    targetUserData[0].dataValues.targetUserAmount -
    currentUserData[0].dataValues.currentUserAmount;
  return {
    amountDifference,
  };
};

const overallExpenseOfCurrentUser = async (userData) => {
  let currentUserId = userData.id;

  let borrow = await models.Transaction.findAll({
    attributes: [
      [Sequelize.fn("sum", Sequelize.col("amount_to_pay")), "borrow"],
    ],
    where: {
      payerId: currentUserId,
    },
  });
  let lent = await models.Transaction.findAll({
    attributes: [[Sequelize.fn("sum", Sequelize.col("amount_to_pay")), "lent"]],
    where: {
      payeeId: currentUserId,
    },
  });
  let amountDifference = lent[0].dataValues.lent - borrow[0].dataValues.borrow;
  return {
    amountDifference,
  };
};

const AllTransactionWithTargetUser = async (userData, params) => {
  let currentUserId = userData.id;
  let targetUserId = params.id;

  let targetUserData = await models.User.findOne({
    where: { id: targetUserId },
  });
  if (!targetUserData) throw new Error("User Not Found!");

  let lentToTargetUser = await models.Transaction.findAll({
    where: {
      payeeId: currentUserId,
      payerId: targetUserId,
    },
    include: [
      {
        model: models.Expense,
        as: "expense",
        include: [
          {
            model: models.Group,
            as: "group",
          },
        ],
      },
    ],
  });
  let borrowFromTargetUser = await models.Transaction.findAll({
    where: {
      payeeId: targetUserId,
      payerId: currentUserId,
    },
    include: [
      {
        model: models.Expense,
        as: "expense",
        include: [
          {
            model: models.Group,
            as: "group",
          },
        ],
      },
    ],
  });
  return {
    borrowFromTargetUser,
    lentToTargetUser,
  };
};

module.exports = {
  addFriend,
  addExpense,
  simplifyDebts,
  overallExpenseOfCurrentUser,
  AllTransactionWithTargetUser,
};
