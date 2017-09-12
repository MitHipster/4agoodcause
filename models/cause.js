/*jslint esversion: 6, browser: true*/
module.exports = (sequelize, DataTypes) => {
  // Set constructor equal to table definition
  const Cause = sequelize.define('Cause', {
    // Define fields, set properties and add validation
    causeName: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [1, 60]
      }
    },
  }, {
    timestamps: false
  });
  // Associate with another table (or model)
  Cause.associate = (models) => {
    Cause.hasMany(models.Charity, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
  };
  return Cause;
};
