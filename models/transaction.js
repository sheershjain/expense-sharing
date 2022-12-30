"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "payee_id",
        targetKey: "id",
        as: "payeeUser",
      });
      this.belongsTo(models.User, {
        foreignKey: "payer_id",
        targetKey: "id",
        as: "payerUser",
      });
      this.belongsTo(models.Expense, {
        foreignKey: "expense_id",
        targetKey: "id",
        as: "expense",
      });
    }
  }
  Transaction.init(
    {
      expenseId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "expense",
          key: "id",
        },
      },
      payeeId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      payerId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      amountToPay: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      isSettle: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "transaction",
      modelName: "Transaction",
    }
  );
  return Transaction;
};
