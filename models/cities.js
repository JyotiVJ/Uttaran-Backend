'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cities.init({
    country_id: DataTypes.INTEGER,
    state_id: DataTypes.INTEGER,
    city_name: DataTypes.STRING,
    city_status: {
      type: DataTypes.ENUM,
      values: ['0','1']
    },
  }, {
    sequelize,
    modelName: 'Cities',
  });
  return Cities;
};