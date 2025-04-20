const { Sequelize } = require("sequelize");
const NoteModel = require("./note.js");
const UserModel = require("./user.js");
const RoleModel = require("./role.js");
const PermissionModel = require("./permission.js");
const RolePermissionModel = require("./rolepermission.js");

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
db.Permission = PermissionModel(sequelize, Sequelize);
db.RolePermission = RolePermissionModel(sequelize, Sequelize);

// Create associations after all models are initialized
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
