'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class social_events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  social_events.init({
    title:DataTypes.STRING,
    socialPrimaryImage:DataTypes.STRING,
    social_event_date: DataTypes.DATEONLY,
    is_active: {
      type: DataTypes.ENUM,
      values: ['0','1']
    },
  }, {
    sequelize,
    modelName: 'social_events',
  });
  return social_events;
};