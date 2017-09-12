/*jslint esversion: 6, browser: true*/
module.exports = (sequelize, DataTypes) => {
  // Set constructor equal to table definition
  const State = sequelize.define('State', {
    // Define fields, set properties and add validation
    abbrev: {
      type: DataTypes.STRING(2),
      primaryKey: true,
      allowNull: false,
      validate: {
        len: [2]
      }
    },
    stateName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    }
  }, {
    timestamps: false
  });
  // Associate with another table (or model)
  State.associate = models => {
    State.hasMany(models.Donor, {
      onDelete: "CASCADE"
    });
  };

  return State;
};
