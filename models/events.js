'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Events.init({
    event_image: DataTypes.TEXT,
    event_title: DataTypes.STRING,
    event_location: DataTypes.STRING,
    event_date: DataTypes.DATE,
    event_description: DataTypes.TEXT,
    event_type: {
      type: DataTypes.ENUM,
      values: ['1','2','3']
    },
    event_status: {
      type: DataTypes.ENUM,
      values: ['0','1']
    },
  }, {
    sequelize,
    modelName: 'events',
  });
  return Events;
};