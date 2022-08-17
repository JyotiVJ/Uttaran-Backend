'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('podcast_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      artist_id: {
        type: Sequelize.INTEGER
      },
      details: {
        type: Sequelize.STRING
      },
      cover_image: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.ENUM,
        values: ['0','1']
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
    await queryInterface.dropTable('podcast_categories');
  }
};