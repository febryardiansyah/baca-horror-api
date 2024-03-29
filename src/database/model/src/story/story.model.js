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
    },
    total_views: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // deletedAt: 'deleted_at',
    // timestamps: true,
    // paranoid: true,
    defaultScope:{
        attributes: {
            exclude: ['contents']
        }
    },
    scopes: {
        with_contents: {
            attributes:{
                include: ['contents']
            }
        }
    }
})

module.exports = StoryModel;