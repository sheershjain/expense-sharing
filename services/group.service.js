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

const updateFriendList = async (friendList) => {
  for (const friend of friendList) {
    let friendOneId = friend[0];
    let friendTwoId = friend[1];
    let friendOne = await models.User.findOne({
      where: { id: friendOneId },
    });
    if (!friendOne) throw new Error("User Not Found!");
    let friendTwo = await models.User.findOne({
      where: { id: friendTwoId },
    });
    if (!friendTwo) throw new Error("User Not Found!");

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

    if (!existingRelation) {
      let createRelation = await models.FriendList.create({
        friendOne: friendOneId,
        friendTwo: friendTwoId,
      });
    }
  }
  return;
};

const createGroup = async (payload) => {
  let groupCreate = await models.Group.create(payload);
  return groupCreate;
};

const addMember = async (payload, userData) => {
  let { groupId, groupMember } = payload;
  groupMember.push(userData.id);
  let friendCombinations = [];
  let friendCombination = [];

  let existingGroup = await models.Group.findOne({
    where: {
      id: groupId,
    },
  });
  if (!existingGroup) throw new Error("Group not found!");

  let combinationUtil = async (groupMember, n) => {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        friendCombinations.push([groupMember[i], groupMember[j]]);
      }
    }
    return;
  };

  await combinationUtil(groupMember, groupMember.length);
  await updateFriendList(friendCombinations);
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

  for (const member of groupMember) {
    await addMemberInGroup(member);
  }
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
        transactions.push(transaction);
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
    console.log(expense, transactions);
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

const expenseDetail = async (params) => {
  let expenseId = params.id;

  let existingExpenseId = await models.Expense.findOne({
    where: { id: expenseId },
    include: [
      {
        model: models.Transaction,
        as: "transactions",
      },
    ],
  });
  if (!existingExpenseId || !existingExpenseId.dataValues.transactions)
    throw new Error("Expense Id not found");
  return existingExpenseId;
};

const groupExpenses = async (params) => {
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
  });
  return expenses;
};

const allGroupOfCurrentUser = async (userData) => {
  console.log(userData);
  let currentUserId = userData.id;

  let groups = await models.GroupUserMapping.findAll({
    where: { userId: currentUserId },
    include: [
      {
        model: models.Group,
        as: "group",
      },
    ],
  });
  return groups;
};

const leaveGroup = async (userData, params) => {
  let currentUserId = userData.id;
  let groupId = params.id;
  let existingGroup = await models.Group.findOne({
    where: {
      id: groupId,
    },
  });
  if (!existingGroup) throw new Error("Group not found!");

  let pendingTransaction = await models.Expense.findAll({
    where: {
      groupId: groupId,
    },
    include: [
      {
        model: models.Transaction,
        as: "transactions",
        where: {
          [Op.or]: [
            {
              payeeId: currentUserId,
            },
            {
              payerId: currentUserId,
            },
          ],
        },
      },
    ],
  });

  for (const expense of pendingTransaction) {
    if (expense.dataValues.transactions) throw new Error("Pending transactions");
  }

  await models.GroupUserMapping.destroy({
    where: {
      [Op.and]: [{ groupId: groupId }, { userId: currentUserId }],
    },
  });
  return;
};

module.exports = {
  createGroup,
  addMember,
  addExpense,
  simplifyDebts,
  expenseDetail,
  groupExpenses,
  allGroupOfCurrentUser,
  leaveGroup,
};
