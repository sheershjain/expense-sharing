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
      this.hasMany(models.Transaction, {
        foreignKey: "expense_id",
        targetKey: "id",
        as: "transactions",
      });
      this.belongsTo(models.Group, {
        foreignKey: "group_id",
        targetKey: "id",
        as: "group",
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
    },
    {
      sequelize,
      paranoid: true,
      tableName: "expense",
      modelName: "Expense",
    }
  );
  return Transaction;
};
