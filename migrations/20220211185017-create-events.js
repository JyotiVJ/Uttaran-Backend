'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      event_image:{
        allowNull: true,
        type: Sequelize.TEXT
      },
      event_title: {
        allowNull: true,
        type: Sequelize.STRING
      },
      event_location: {
        allowNull: true,
        type: Sequelize.STRING
      },
      event_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      event_description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      event_status: {
        type: Sequelize.ENUM,
        values: ['0','1']
      },
      event_type: {
        type: Sequelize.ENUM,
        values: ['1','2','3']
      },
      createdAt: {
        allowNull: false,
        defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue : Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('events');
  }
};