const { Sequelize } = require("sequelize");
const NoteModel = require("./note.js");
const UserModel = require("./user.js");
const RoleModel = require("./role.js");

const sequelize = new Sequelize("freedom_wall", "root", "", {
  host: "localhost",
  port: "3306",
  dialect: "mysql",
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// models
db.Note = NoteModel(sequelize, Sequelize);
db.User = UserModel(sequelize, Sequelize);
db.Role = RoleModel(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
