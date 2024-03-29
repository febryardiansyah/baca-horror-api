const { Sequelize } = require('sequelize')
const config = require('../config/config')

const db = new Sequelize(config.DB.name, config.DB.user, config.DB.password, {
    host: config.DB.host,
    dialect: config.DB.dialect,
    logging: false,
    port: config.DB.port,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
})

module.exports = db