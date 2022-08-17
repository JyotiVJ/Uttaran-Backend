'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Motivations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Motivations.init({
    motivation_title   : DataTypes.STRING,
    social	           : DataTypes.STRING,
    cultural           : DataTypes.STRING,
    educational        : DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'motivations',
  });
  return Motivations;
};