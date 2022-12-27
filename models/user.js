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
      this.hasMany(models.Transaction, {
        foreignKey: 'payee_id',
        as: 'payee'
      });
      this.hasMany(models.Transaction, {
        foreignKey: 'payer_id',
        as: 'payer'
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
    }
  }, {
    sequelize,
    paranoid: true,
    tableName: 'user',
    modelName: 'User',
  });
  return User;
};