'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class album_images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  album_images.init({
    album_id: DataTypes.INTEGER,
    album_images: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'album_images',
  });
  return album_images;
};