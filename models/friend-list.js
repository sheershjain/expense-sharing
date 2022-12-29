"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FriendList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "friend_one",
        targetKey: "id",
        as: "user"
      });
      this.belongsTo(models.User, {
        foreignKey: "friend_two",
        targetKey: "id",
        as: "user"
      });
    }
  }
  FriendList.init(
    {
      friend_one: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      friend_two: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "friend_list",
      modelName: "FriendList",
    }
  );
  return FriendList;
};
