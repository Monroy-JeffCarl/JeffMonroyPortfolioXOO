'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, check if roles exist
    const existingRoles = await queryInterface.sequelize.query(
      'SELECT role_title FROM Roles',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const existingRoleTitles = existingRoles.map(role => role.role_title);
    const rolesToInsert = [
      {
        role_title: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_title: 'Moderator',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_title: 'User',
        created_at: new Date(),
        updated_at: new Date()
      }
    ].filter(role => !existingRoleTitles.includes(role.role_title));

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert('Roles', rolesToInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
}; 