'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    payee_id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    payer_id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    amount: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    split_type: {
      type: Sequelize.ENUM,
      values: ['equally', 'unequally', 'exactly']
    },
    group_id: {
      allowNull: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    is_settle: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    paranoid: true,
    tableName: 'transaction',
    modelName: 'Transaction',
  });
  return Transaction;
};