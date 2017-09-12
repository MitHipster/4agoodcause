/*jslint esversion: 6, browser: true*/
module.exports = (sequelize, DataTypes) => {
  // Set constructor equal to table definition
  const Charity = sequelize.define('Charity', {
    // Define fields, set properties and add validation
    ein: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        len: 9
      }
    },
    charityName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    tagline: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    }
  });
  // Associate with another table (or model)
  Charity.associate = models => {
    Charity.hasMany(models.Donation, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Charity.hasMany(models.Transaction, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Charity.belongsTo(models.Category, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Charity.belongsTo(models.Cause, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
  };
  return Charity;
};
