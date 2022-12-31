const { Op } = require("sequelize");

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

module.exports = {
  createGroup,
  addMember,
};
