const dotenv = require("dotenv").config();
console.log(process.env)

module.exports = {
  development: {
    username: dotenv.parsed.DB_USERNAME,
    password: dotenv.parsed.DB_PASSWORD,
    database: dotenv.parsed.DB_NAME,
    host: dotenv.parsed.DB_HOST,
    dialect: 'mysql', 
    port: dotenv.parsed.DB_PORT
  },
  test: {
    username: dotenv.parsed.DB_USERNAME,
    password: dotenv.parsed.DB_PASSWORD,
    database: dotenv.parsed.DB_NAME,
    host: dotenv.parsed.DB_HOST,
    dialect: 'mysql', 
    port: dotenv.parsed.DB_PORT
  },
  production: {
    username: dotenv.parsed.DB_USERNAME,
    password: dotenv.parsed.DB_PASSWORD,
    database: dotenv.parsed.DB_NAME,
    host: dotenv.parsed.DB_HOST,
    dialect: 'mysql', 
    port: dotenv.parsed.DB_PORT
  }
};
