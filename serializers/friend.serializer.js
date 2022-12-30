const addFriendData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};

  if (reciveData) {
    resultData = {
      id: reciveData.dataValues.id,
      friendOne: reciveData.dataValues.friendOne,
      friendTwo: reciveData.dataValues.friendTwo,
    };
  }
  res.data = resultData;
  next();
};

const addExpenseData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};
  if (reciveData) {
    resultData = {
      expense: {
        id: reciveData.expense.dataValues.id,
        name: reciveData.expense.dataValues.name,
        baseAmount: reciveData.expense.dataValues.baseAmount,
        splitType: reciveData.expense.dataValues.splitType,
        transaction: {
          payeeId: reciveData.transaction.dataValues.payeeId,
          payerId: reciveData.transaction.dataValues.payerId,
          amountToPay: reciveData.transaction.dataValues.amountToPay,
          isSettle: reciveData.transaction.dataValues.isSettle,
        },
      },
    };
  }
  res.data = resultData;
  next();
};

const AllTransactionWithTargetUserData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};

  if (reciveData) {
    let borrowFromTargetUser = [];
    let lentToTargetUser = [];
    reciveData.borrowFromTargetUser.forEach((element) => {
      let parentObject = {
        id: element.dataValues.id,
        payeeId: element.dataValues.payeeId,
        payerId: element.dataValues.payeeId,
        amountToPay: element.dataValues.amountToPay,
        isSettle: element.dataValues.isSettle,
        expense: {
          id: element.dataValues.expense.id,
          name: element.dataValues.expense.name,
          baseAmount: element.dataValues.expense.baseAmount,
          splitType: element.dataValues.expense.splitType,
        },
      };
      if (element.dataValues.expense.groupId) {
        let group = {
          id: element.dataValues.expense.group.id,
          name: element.dataValues.expense.group.name,
          category: element.dataValues.expense.group.category,
        };
        parentObject.expense.group = group;
      }
      borrowFromTargetUser.push(parentObject);
    });

    reciveData.lentToTargetUser.forEach((element) => {
      let parentObject = {
        id: element.dataValues.id,
        payeeId: element.dataValues.payeeId,
        payerId: element.dataValues.payeeId,
        amountToPay: element.dataValues.amountToPay,
        isSettle: element.dataValues.isSettle,
        expense: {
          id: element.dataValues.expense.id,
          name: element.dataValues.expense.name,
          baseAmount: element.dataValues.expense.baseAmount,
          splitType: element.dataValues.expense.splitType,
        },
      };
      if (element.dataValues.expense.groupId) {
        let group = {
          id: element.dataValues.group.id,
          name: element.dataValues.group.name,
          category: element.dataValues.group.category,
        };
        parentObject.expense.group = group;
      }
      lentToTargetUser.push(parentObject);
    });
    resultData = {
      borrowFromTargetUser,
      lentToTargetUser,
    };
  }
  res.data = resultData;
  next();
};

module.exports = {
  addFriendData,
  addExpenseData,
  AllTransactionWithTargetUserData,
};
