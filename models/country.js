'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Country.init({
    countryName: DataTypes.STRING,
    countryFlag: DataTypes.STRING,
    countryCode: DataTypes.STRING,
    countrySymbol: DataTypes.STRING,
    countryStatus: {
      type: DataTypes.ENUM,
      values: ['0','1']
    },
  }, {
    sequelize,
    modelName: 'Country',
  });
  return Country;
};