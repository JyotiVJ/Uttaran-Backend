'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AboutUs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AboutUs.init({
    aboutUs_title   : DataTypes.STRING,
    aboutUs_body	: DataTypes.TEXT,
    aboutUs_image   : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'about_us',
  });
  return AboutUs;
};