const {DataTypes} = require('sequelize')
const db = require('../../../database')

const UserModel = db.define('user',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email_verified:{
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    email_verification_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
},{
    scopes: {
        with_password: {
            attributes: {
                include: ['password']
            }
        }
    },
    defaultScope: {
        attributes: {
            exclude: ['password']
        }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // deletedAt: 'deleted_at',
    // timestamps: true,
    // paranoid: true,
});

module.exports = UserModel;