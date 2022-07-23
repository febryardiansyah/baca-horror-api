const { DataTypes } = require("sequelize");
const db = require("../../../database");

const ReportedComment = db.define('reported_comment', {
    commentId: {
        type: DataTypes.BIGINT
    },
    message: {
        type: DataTypes.STRING,
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = ReportedComment