/*jslint esversion: 6, browser: true*/
module.exports = (sequelize, DataTypes) => {
  // Set constructor equal to table definition
  const Payment = sequelize.define('Payment', {
    // Define fields, set properties and add validation
    cardName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    },
    cardNumber: {
      type: DataTypes.STRING(16),
      allowNull: false,
      validate: {
        len: [14, 16]
      }
    },
    cardToken: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        len: [1, 25]
      }
    },
    expireMth: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      validate: {
        len: [2]
      }
    },
    expireYr: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      validate: {
        len: [4]
      }
    },
    cvc: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      validate: {
        len: [3]
      }
    }
  });
  // Associate with another table (or model)
  Payment.associate = models => {
    Payment.hasMany(models.Transaction, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Payment.belongsTo(models.Donor, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
  };

  return Payment;
};
