/*jslint esversion: 6, browser: true*/
module.exports = (sequelize, DataTypes) => {
  // Set constructor equal to table definition
  const Donor = sequelize.define('Donor', {
    // Define fields, set properties and add validation
    nameFirst: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        len: [1, 25]
      }
    },
    nameLast: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        len: [1, 25]
      }
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    locationStreet: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    locationCity: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        len: [1, 25]
      }
    },
    locationZip: {
      type: DataTypes.CHAR(5),
      allowNull: false,
      validate: {
        len: [5]
      }
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    phone: {
      type: DataTypes.CHAR(12),
      allowNull: false,
      validate: {
        len: [12]
      }
    },
    profileImg: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [1, 30]
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    }
  });
  // Associate with another table (or model)
  Donor.associate = models => {
    Donor.hasMany(models.Donation, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Donor.hasOne(models.Payment, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Donor.hasMany(models.Transaction, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE'
    });
    Donor.belongsTo(models.State, {
      foreignKey: {
        allowNull: false,
        validate: {
          len: [2]
        }
      },
      onDelete: 'CASCADE'
    });
  };

  return Donor;
};
