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
      id: reciveData.dataValues.id,
      name: reciveData.dataValues.name,
      baseAmount: reciveData.dataValues.baseAmount,
      payeeId: reciveData.dataValues.payeeId,
      payerId: reciveData.dataValues.payerId,
      splitType: reciveData.dataValues.splitType,
      payeeId: reciveData.dataValues.payeeId,
      amountToPay: reciveData.dataValues.amountToPay,
      isSettle: reciveData.dataValues.isSettle,
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
        name: element.dataValues.name,
        baseAmount: element.dataValues.baseAmount,
        payeeId: element.dataValues.payeeId,
        payerId: element.dataValues.payerId,
        splitType: element.dataValues.splitType,
        payeeId: element.dataValues.payeeId,
        amountToPay: element.dataValues.amountToPay,
        isSettle: element.dataValues.isSettle,
      };
      if (element.dataValues.groupId) {
        let group = {
          id: element.dataValues.group.id,
          name: element.dataValues.group.name,
          category: element.dataValues.group.category,
        };
        parentObject.group = group;
      }
      borrowFromTargetUser.push(parentObject);
    });

    reciveData.lentToTargetUser.forEach((element) => {
      let parentObject = {
        id: element.dataValues.id,
        name: element.dataValues.name,
        baseAmount: element.dataValues.baseAmount,
        payeeId: element.dataValues.payeeId,
        payerId: element.dataValues.payerId,
        splitType: element.dataValues.splitType,
        payeeId: element.dataValues.payeeId,
        amountToPay: element.dataValues.amountToPay,
        isSettle: element.dataValues.isSettle,
      };
      if (element.dataValues.groupId) {
        let group = {
          id: element.dataValues.group.id,
          name: element.dataValues.group.name,
          category: element.dataValues.group.category,
        };
        parentObject.group = group;
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
