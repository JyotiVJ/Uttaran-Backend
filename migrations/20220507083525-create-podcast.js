'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('podcasts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      podcast_category_id: {
        type: Sequelize.INTEGER
      },
      cover_picture: {
        type: Sequelize.INTEGER
      },
      length: {
        type: Sequelize.STRING
      },
      file_name: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('podcasts');
  }
};