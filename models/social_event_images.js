'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class social_event_images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  social_event_images.init({
    social_event_id:DataTypes.STRING,
    images:DataTypes.STRING,
    is_active: {
      type: DataTypes.ENUM,
      values: ['0','1']
    },
  }, {
    sequelize,
    modelName: 'social_event_images',
  });
  return social_event_images;
};