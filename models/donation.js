/*jslint esversion: 6, browser: true*/
module.exports = (sequelize, DataTypes) => {
  // Set constructor equal to table definition
  const Donation = sequelize.define('Donation', {
    // Define fields, set properties and add validation
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  });
  // Associate with another table (or model)
  Donation.associate = models => {
    Donation.belongsTo(models.Donor, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Donation.belongsTo(models.Charity, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
  };

  return Donation;
};
