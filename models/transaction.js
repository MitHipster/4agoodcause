/*jslint esversion: 6, browser: true*/
module.exports = (sequelize, DataTypes) => {
  // Set constructor equal to table definition
  const Transaction = sequelize.define('Transaction', {
    // Define fields, set properties and add validation
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  });
  // Associate with another table (or model)
  Transaction.associate = models => {
    Transaction.belongsTo(models.Donor, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Transaction.belongsTo(models.Charity, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Transaction.belongsTo(models.Payment, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
  };
  return Transaction;
};
