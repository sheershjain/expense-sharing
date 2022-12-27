'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FriendList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FriendList.init({
    friend_one: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    friend_two: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    status: {
      type: Sequelize.ENUM,
      values: ['pending', 'approved']
    }
  }, {
    sequelize,
    paranoid: true,
    tableName: 'friend_list',
    modelName: 'FriendList',
  });
  return FriendList;
};