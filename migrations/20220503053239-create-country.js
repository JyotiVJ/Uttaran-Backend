'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Countries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      countryName: {
        type: Sequelize.STRING
      },
      countryFlag: {
        type: Sequelize.STRING
      },
      countryCode: {
        type: Sequelize.STRING
      },
      countrySymbol: {
        type: Sequelize.STRING
      },
       countryStatus: {
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
    await queryInterface.dropTable('Countries');
  }
};