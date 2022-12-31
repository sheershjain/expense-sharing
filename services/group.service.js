const { Op } = require("sequelize");

const { sequelize } = require("../models");
const models = require("../models");

const createGroup = async (payload) => {
  let groupCreate = await models.Group.create(payload);
  return groupCreate;
};

const addMember = async (payload, userData) => {
  let { groupId, member } = payload;

  let existingGroup = await models.Group.findOne({
    where: {
      id: groupId,
    },
  });
  if (!existingGroup) throw new Error("Group not found!");

  let addMemberInGroup = async (userId) => {
    let existingMapping = await models.GroupUserMapping.findOne({
      where: {
        [Op.and]: [
          {
            groupId: groupId,
          },
          {
            userId: userId,
          },
        ],
      },
    });
    if (!existingMapping) {
      await models.GroupUserMapping.create({
        groupId: groupId,
        userId: userId,
      });
    }
  };

  member.forEach(async (element) => {
    await addMemberInGroup(element);
  });
  addMemberInGroup(userData.id);

  return;
};

const addExpense = async (payload) => {
  let { groupId, baseAmount, splitType, payeeId, member, payerAmount } =
    payload;
  let amountToPay;
  let existingGroup = await models.Group.findOne({
    where: {
      id: groupId,
    },
  });
  if (!existingGroup) throw new Error("Group not found!");
  let expense,
    transactions = [];
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
    if (splitType === "equally") {
      amountToPay = baseAmount / (member.length + 1);
      member.forEach(async (element) => {
        transaction = await models.Transaction.create(
          {
            expenseId: expense.dataValues.id,
            payeeId: payeeId,
            payerId: element,
            amountToPay: amountToPay,
          },
          { transaction: t }
        );
      });
    } else if (splitType === "unequally") {
      let i = 0;
      for (const element of member) {
        transaction = await models.Transaction.create(
          {
            expenseId: expense.dataValues.id,
            payeeId: payeeId,
            payerId: element,
            amountToPay: payerAmount[i],
          },
          { transaction: t }
        );
        transactions.push(transaction);
        i++;
      }
    }
    await t.commit();
    return {
      expense,
      transactions,
    };
  } catch (error) {
    await t.rollback();
    throw new Error("Something went wrong");
  }
};

module.exports = {
  createGroup,
  addMember,
  addExpense,
};
