require('dotenv').config()

const MODE = process.env.SERVER_MODE
const dev = MODE === 'DEV'

module.exports = {
    SERVER: {
        port: process.env.PORT,
        secret: process.env.SECRET,
        mode: MODE,
    },
    DB: {
        host: dev ? process.env.DB_HOST : process.env.DB_HOST_PROD,
        user: dev ? process.env.DB_USER : process.env.DB_USER_PROD,
        password: dev ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_PROD,
        name: dev ? process.env.DB_NAME : process.env.DB_NAME_PROD,
        dialect: 'mysql',
        port: dev ? process.env.DB_PORT : process.env.DB_PORT_PROD
    },
    ROLE: {
        admin: 'ADMIN',
        user: 'USER'
    },
    EMAIL: {
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
    }
}