'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class podcast_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  podcast_category.init({
    name: DataTypes.STRING,
    details: DataTypes.STRING,
    cover_image: DataTypes.STRING,
    is_active: {
      type: DataTypes.ENUM,
      values: ['0','1']
    },
  }, {
    sequelize,
    modelName: 'podcast_category',
  });
  return podcast_category;
};