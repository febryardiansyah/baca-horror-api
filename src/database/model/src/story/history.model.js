const { DataTypes } = require("sequelize");
const db = require("../../../database");

const HistoryModel = db.define('history', {
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    storyId: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = HistoryModel