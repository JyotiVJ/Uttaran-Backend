'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class podcast extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  podcast.init({
    name: DataTypes.STRING,
    podcast_category_id: DataTypes.INTEGER,
    cover_picture: DataTypes.STRING,
    length: DataTypes.STRING,
    file_name: DataTypes.STRING,
    details: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'podcast',
  });
  return podcast;
};