'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Homes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Homes.init({
    title_one: DataTypes.STRING,
    title_two: DataTypes.STRING,
    sub_title: DataTypes.STRING,
    youtube_link: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'homes',
  });
  return Homes;
};