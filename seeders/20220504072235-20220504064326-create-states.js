'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

  return queryInterface.addColumn('states', 'state_status', {
      type: Sequelize.STRING,
      after: "state_name"
    });
  },
  

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
