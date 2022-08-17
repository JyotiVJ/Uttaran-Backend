'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Admins.init({
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    contact_no: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    facebook_link: DataTypes.STRING,
    twitter_link: DataTypes.STRING,
    google_plus_link: DataTypes.STRING,
    is_active: DataTypes.INTEGER,
    type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'admins',
  });
  return Admins;
};