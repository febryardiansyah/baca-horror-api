const { DataTypes } = require("sequelize");
const db = require("../../../database");

const AuthorModel = db.define('author',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    twitter_url: {
        type: DataTypes.STRING,
        allowNull: false
    }

},{
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // deletedAt: 'deleted_at',
    // timestamps: true,
    // paranoid: true,
})

module.exports = AuthorModel