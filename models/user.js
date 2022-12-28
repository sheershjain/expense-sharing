'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.FriendList, {
        foreignKey: 'friend_one',
        as: 'friend_one'
      });
      this.hasMany(models.FriendList, {
        foreignKey: 'friend_two',
        as: 'friend_two'
      });
    }
  }
  User.init({
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
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
    },
    google_id: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: 'user',
    modelName: 'User',
  });
  return User;
};