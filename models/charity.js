/*jslint esversion: 6, browser: true*/
module.exports = (sequelize, DataTypes) => {
  // Set constructor equal to table definition
  const Charity = sequelize.define('Charity', {
    ein: {
      type: DataTypes.STRING(9),
      primaryKey: true,
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    }
  });
  // Associate with another table (or model)
  Charity.associate = models => {
    Charity.belongsTo(models.Category, {
      foreignKey: {
        allowNull: false,
      }
    });
    Charity.belongsTo(models.Cause, {
      foreignKey: {
        allowNull: false,
      }
    });
  };
  return Charity;
};
