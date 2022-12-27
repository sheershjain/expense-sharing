'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'payee_id',
        targetKey: 'id'
      });
      this.belongsTo(models.User, {
        foreignKey: 'payer_id',
        targetKey: 'id'
      });
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
      references: {
        model: 'user',
        key: 'id',
      }
    },
    payer_id: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'user',
        key: 'id',
      }
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