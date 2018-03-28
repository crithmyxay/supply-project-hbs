const Sequelize = require('sequelize');
const sequelize = new Sequelize('supply-users', 'christopher.rithmyxay', '', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;