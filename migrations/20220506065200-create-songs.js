'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      genre_id:{
        type: Sequelize.INTEGER
      }
      name: {
        type: Sequelize.STRING
      },
      cover_picture: {
        type: Sequelize.STRING
      },
      length: {
        type: Sequelize.STRING
      },
      file_name: {
        type: Sequelize.STRING
      },
      release_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      details: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '0 => Inactive, 1 => Active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Songs');
  }
};