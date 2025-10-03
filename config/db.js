const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, 
  }
);


const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    await sequelize.sync({ alter: true }); 
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database or sync:', error);
  }
};

module.exports = { sequelize, syncDatabase };