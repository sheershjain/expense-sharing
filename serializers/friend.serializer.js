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
      groupId: reciveData.dataValues.groupId || undefined,
      isSettle: reciveData.dataValues.isSettle,
    };
  }
  res.data = resultData;
  next();
};

module.exports = {
  addFriendData,
  addExpenseData,
};
