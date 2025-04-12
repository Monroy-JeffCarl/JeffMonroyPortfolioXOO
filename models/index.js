const { Sequelize } = require("sequelize");
const NoteModel = require("./note.js");

const sequelize = new Sequelize("freedom_wall", "root", "", {
  host: "localhost",
  //npmport: "6400";
  dialect: "mysql",
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Note = NoteModel(sequelize, Sequelize);

module.exports = db;
