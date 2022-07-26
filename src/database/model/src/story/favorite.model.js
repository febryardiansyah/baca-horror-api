const { DataTypes } = require("sequelize");
const db = require("../../../database");

const FavoriteModel = db.define('favorite', {
    storyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = FavoriteModel