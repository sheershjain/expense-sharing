"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Transaction, {
        foreignKey: 'payee_id',
        as: 'payee'
      });
      this.hasMany(models.Transaction, {
        foreignKey: 'payer_id',
        as: 'payer'
      });
      this.hasMany(models.FriendList, {
        foreignKey: 'friend_one',
        as: 'friendOne'
      });
      this.hasMany(models.FriendList, {
        foreignKey: 'friend_two',
        as: 'friendTwo'
      });
    }
  }
  User.init({
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    paranoid: true,
    tableName: 'user',
    modelName: 'User',
  });
  return User;
};
