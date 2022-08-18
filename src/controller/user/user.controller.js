const { UserModel, StoryModel } = require("../../database/model/model");
const { errorResponse } = require("../../utils/error_response");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require("../../config/config");
const sequelize = require("sequelize");

exports.createUser = async (req, res) => {
    const { name, email, password, role, } = req.body;
    try {
        // bcrypt password
        const hashedPassword = bcrypt.hashSync(password, 8)
        // create user
        const user = await UserModel.create({
            name, email, password: hashedPassword, role, img: 'https://res.cloudinary.com/febryar/image/upload/v1598796112/no_avatar_weaizx.jpg',
        })
        // remove password from object
        user.password = undefined

        return res.send({
            message: 'Buat akun berhasil!',
            data: user
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status()
    }
    try {
        // get user with password
        const user = await UserModel.scope('with_password').findOne({
            where: {
                email,
            },
            raw: true,
        })
        if (!user) {
            return res.status(404).send({
                message: 'Email belum terdaftar'
            })
        }
        const passwordValid = bcrypt.compareSync(password, user.password)
        if (!passwordValid) {
            return res.send.status(401).send({
                message: 'Password yang kamu masukan salah'
            })
        }
        delete user.password;
        const token = await jwt.sign({ id: user.id }, config.SERVER.secret,)
        res.send({
            message: 'Login berhasil!',
            token,
            data: user
        })
    } catch (error) {
        console.log(error);
        errorResponse(res, error)
    }
}

exports.getMyProfile = async (req, res) => {
    try {
        const user = await UserModel.findByPk(req.userId, {
            include: [
                {
                    model: StoryModel,
                    as: 'stories_like',
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    // [sequelize.literal('(select count(*) from likes as ul where ul.userId = User.id)'), 'stories_liked']
                    [sequelize.fn('COUNT',sequelize.col('stories_like.id')),'stories_liked']
                ]
            },
        })

        return res.send({
            message: 'Get my profile berhasil',
            data: user
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.updateProfile = async (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).send({
            message: 'Nama tidak boleh kosong'
        })
    }
    try {
        await UserModel.update({
            name
        },{
            where: {
                id: req.userId
            }
        })

        return res.send({
            message: 'Update profile berhasil',
        })
    } catch (error) {
        errorResponse(res, error)
    }
}