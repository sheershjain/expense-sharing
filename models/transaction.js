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
      });
      this.belongsTo(models.User, {
        foreignKey: "payer_id",
        targetKey: "id",
      });
    }
  }
  Transaction.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      baseAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      splitType: {
        type: Sequelize.ENUM,
        values: ["equally", "unequally", "exactly"],
      },
      groupId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "group",
          key: "id",
        },
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
