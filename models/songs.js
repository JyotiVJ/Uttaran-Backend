'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Songs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Songs.init({
    name: DataTypes.STRING,
    genre_id: DataTypes.STRING,
    event_id: DataTypes.STRING,
    cover_picture: DataTypes.STRING,
    length: DataTypes.STRING,
    file_name: DataTypes.STRING,
    release_date: DataTypes.DATE,
    details: DataTypes.STRING,
    is_active: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Songs',
  });
  return Songs;
};