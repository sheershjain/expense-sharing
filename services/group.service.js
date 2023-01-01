const { Op } = require("sequelize");

const { sequelize } = require("../models");
const models = require("../models");
const BinaryHeap = require("../helper/heap.helper");

const getSimplifyDebts = (transactions) => {
  let score = {};

  for (let i = 0; i < transactions.length; i++) {
    if (score[transactions[i][0]] && score[transactions[i][1]]) {
      score[transactions[i][0]] -= transactions[i][2];
      score[transactions[i][1]] += transactions[i][2];
    } else if (score[transactions[i][0]] && !score[transactions[i][1]]) {
      score[transactions[i][0]] -= transactions[i][2];
      score[transactions[i][1]] = 0;
      score[transactions[i][1]] += transactions[i][2];
    } else if (!score[transactions[i][0]] && score[transactions[i][1]]) {
      score[transactions[i][0]] = 0;
      score[transactions[i][0]] -= transactions[i][2];
      score[transactions[i][1]] += transactions[i][2];
    } else {
      score[transactions[i][0]] = 0;
      score[transactions[i][1]] = 0;
      score[transactions[i][0]] -= transactions[i][2];
      score[transactions[i][1]] += transactions[i][2];
    }
  }

  const pos_heap = new BinaryHeap();
  const neg_heap = new BinaryHeap();

  for (let key in score) {
    if (score[key] > 0) pos_heap.insert([score[key], key]);
    if (score[key] < 0) {
      neg_heap.insert([-score[key], key]);
      score[key] *= -1;
    }
  }

  const new_edges = [];
  while (!pos_heap.empty()) {
    const mx = pos_heap.extractMax();
    const mn = neg_heap.extractMax();

    const amt = Math.min(mx[0], mn[0]);
    const to = mx[1];
    const from = mn[1];

    new_edges.push({ from: from, to: to, label: amt });

    score[to] -= amt;
    score[from] -= amt;
    if (mx[0] > mn[0]) {
      pos_heap.insert([score[to], to]);
    } else if (mx[0] < mn[0]) {
      neg_heap.insert([score[from], from]);
    }
  }
  return new_edges;
};

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

  for (const element of member) {
    await addMemberInGroup(element);
  }
  addMemberInGroup(userData.id);
  let groupDetail = await models.GroupUserMapping.findAll({
    where: {
      groupId: groupId,
    },
    include: [
      {
        model: models.Group,
        as: "group",
      },
      {
        model: models.User,
        as: "user",
      },
    ],
  });
  console.log(groupDetail);
  return groupDetail;
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
      for (const element of member) {
        transaction = await models.Transaction.create(
          {
            expenseId: expense.dataValues.id,
            payeeId: payeeId,
            payerId: element,
            amountToPay: amountToPay,
          },
          { transaction: t }
        );
      }
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

const simplifyDebts = async (params) => {
  let groupId = params.id;
  let existingGroup = await models.Group.findOne({
    where: {
      id: groupId,
    },
  });
  if (!existingGroup) throw new Error("Group not found!");

  let expenses = await models.Expense.findAll({
    where: {
      groupId: groupId,
    },
    include: [
      {
        model: models.Transaction,
        as: "transactions",
      },
    ],
  });
  let transactions = [];
  for (const expense of expenses) {
    for (const transaction of expense.dataValues.transactions) {
      let filterTransaction = [
        transaction.payerId,
        transaction.payeeId,
        transaction.amountToPay,
      ];
      transactions.push(filterTransaction);
    }
  }
  let result = await getSimplifyDebts(transactions);
  return result;
};

module.exports = {
  createGroup,
  addMember,
  addExpense,
  simplifyDebts,
};
