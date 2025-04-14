module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('notes', [
      {
        nickname: 'JohnDoe',
        note: 'This is a sample note.',
        note_color: '#ffcc00',
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notes', null, {});
  },
};
