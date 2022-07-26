const { DataTypes } = require("sequelize");
const db = require("../../../database");

const CommentModel = db.define('comment', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.BIGINT,
        primaryKey: false,
        unique: false,
    },
    storyId: {
        type: DataTypes.BIGINT,
        primaryKey: false,
        unique: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = CommentModel