const { DataTypes } = require("sequelize");
const db = require("../../../database");

const StoryModel = db.define('story',{
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    synopsis: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contents: {
        type: DataTypes.JSON,
        allowNull: false
    }
},{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = StoryModel;