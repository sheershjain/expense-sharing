const createGroupData = (req, res, next) => {
  let reciveData = res.data || {};
  let resultData = {};

  if (reciveData) {
    resultData = {
      id: reciveData.dataValues.id,
      name: reciveData.dataValues.name,
      category: reciveData.dataValues.category,
    };
  }
  res.data = resultData;
  next();
};

module.exports = {
  createGroupData,
};
