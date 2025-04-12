module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Notes', [
      {
        nickName: 'JohnDoe',
        note: 'This is a sample note.',
        noteColor: '#ffcc00',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Notes', null, {});
  },
};
