'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EducationalEvents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  EducationalEvents.init({
    
    title: DataTypes.STRING,
  
  }, {
    sequelize,
    modelName: 'EducationalEvents',
  });
  return EducationalEvents;
}; 