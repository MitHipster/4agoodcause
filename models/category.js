/*jslint esversion: 6, browser: true*/
module.exports = (sequelize, DataTypes) => {
  // Set constructor equal to table definition
  const Category = sequelize.define('Category', {
    // Define fields, set properties and add validation
    categoryName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    categoryImg: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    }
  }, {
    timestamps: false
  });
  // Associate with another table (or model)
  Category.associate = (models) => {
    Category.hasMany(models.Charity, {
      onDelete: "CASCADE"
    });
  };
  return Category;
};
