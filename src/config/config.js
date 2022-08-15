require('dotenv').config()

module.exports = {
    SERVER: {
        port: process.env.PORT,
        secret: process.env.SECRET,
    },
    DB: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        dialect: 'mysql',
    },
    ROLE: {
        admin: 'ADMIN',
        user: 'USER'
    }
}