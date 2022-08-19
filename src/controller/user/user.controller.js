const { UserModel, StoryModel } = require("../../database/model/model");
const { errorResponse } = require("../../utils/error_response");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require("../../config/config");
const sequelize = require("sequelize");
const BaseServices = require("../../services/BaseServices");

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

        const emailer = await BaseServices.emailVerification(name, email, 'Verifikasi email')
        await user.update({
            email_verification_code: emailer.code
        })
        user.email_verification_code = undefined
        return res.send({
            message: 'Registrasi berhasil! Silakan cek email kamu.',
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
        const checkEmailVerified = await BaseServices.checkEmailVerified(email)
        if (!checkEmailVerified) {
            return res.status(401).send({
                message: 'Email belum di verifikasi'
            })
        }
        const passwordValid = bcrypt.compareSync(password, user.password)
        if (!passwordValid) {
            return res.status(401).send({
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

exports.verifyEmail = async (req, res) => {
    const { code, email } = req.body
    if (!code) {
        return res.status(400).send({ message: 'Kode tidak boleh kosong!' })
    }
    if (!email) {
        return res.status(400).send({ message: 'Email tidak boleh kosong!' })
    }
    try {
        const checkEmailVerified = await BaseServices.checkEmailVerified(email)
        if (checkEmailVerified) {
            return res.status(400).send({
                message: 'Email sudah diverifikasi'
            })
        }
        const validateCode = await BaseServices.validateEmailVerificationCode(email, code)
        if (!validateCode) {
            return res.status(401).send({
                message: 'Kode yang kamu masukan tidak benar'
            })
        }

        const user = await UserModel.findOne({
            where: {
                email
            },
        })

        await user.update({
            email_verified: 1
        })

        return res.send({
            message: 'Email berhasil diverifikasi!'
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).send({
            message: 'Email tidak boleh kosong'
        })
    }
    try {
        const user = await UserModel.findOne({
            where: {
                email
            },
        })
        if (!user) {
            return res.status(404).send({
                message: 'Email belum terdaftar'
            })
        }
        const name = user.toJSON().name
        const emailer = BaseServices.emailVerification(name, email, 'Lupa Password')
        await user.update({
            email_verification_code: emailer.code
        })
        return res.send({
            message: 'Kode berhasil dikirim, silakan cek email kamu'
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.resetPassword = async (req, res) => {
    const { email, code, password } = req.body
    if (!code) {
        return res.status(400).send({ message: 'Kode tidak boleh kosong!' })
    }
    if (!email) {
        return res.status(400).send({ message: 'Email tidak boleh kosong!' })
    }
    if (!password) {
        return res.status(400).send({ message: 'Password tidak boleh kosong!' })
    }
    try {
        const user = await UserModel.scope('with_password').findOne({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(404).send({
                message: 'Email belum terdaftar'
            })
        }

        const isCodeValid = await BaseServices.validateEmailVerificationCode(email, code)
        if (!isCodeValid) {
            return res.status(401).send({
                message: 'Kode yang kamu masukan tidak benar'
            })
        }
        const hashedPassword = bcrypt.hashSync(password, 8)
        await user.update({
            password: hashedPassword,
        })

        return res.send({
            message: 'Reset password berhasil, silakan login kembali!'
        })
    } catch (error) {
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
                    [sequelize.fn('COUNT', sequelize.col('stories_like.id')), 'stories_liked']
                ]
            },
            group: ['id']
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
        }, {
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