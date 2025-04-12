module.exports = (sequelize, Sequelize) => {
  const Note = sequelize.define("Note", {
    nickName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    note: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    noteColor: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    }
  });

  return Note;
};
