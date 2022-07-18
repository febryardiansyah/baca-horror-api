const { StoryModel, AuthorModel, UserModel } = require("../../database/model/model")
const { errorResponse } = require("../../utils/error_response")
const jwt = require('jsonwebtoken')
const config = require("../../config/config")

exports.createAuthorMiddleware = async (req, res, next) => {
    const { url } = req.body
    if (!url) {
        return res.status(400).send({
            message: 'Url tidak boleh kosong'
        })
    }
    next()
}

exports.createStoryMiddleWare = async (req, res, next) => {
    const { title, url, author_id } = req.body
    if (!title) {
        return res.status(400).send({
            message: 'Title tidak boleh kosong'
        })
    }
    if (!url) {
        return res.status(400).send({
            message: 'Url tidak boleh kosong'
        })
    }
    if (!author_id) {
        return res.status(400).send({
            message: 'Author Id tidak boleh kosong'
        })
    }
    try {
        // check author is exist
        // if it false, it will return failure response
        const authorExist = await AuthorModel.findByPk(author_id)
        if (!authorExist) {
            return res.status(400).send({
                message: `Author tidak ditemukan, pastikan memasukan id benar`
            })
        }
        // check story is exist
        const storyExist = await StoryModel.findOne({
            where: {
                url
            }
        })
        if (storyExist) {
            return res.status(400).send({
                message: `Cerita sudah dibuat dengan id: ${storyExist.id}`
            })
        }
        next()
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.requireToken = async (req, res,next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).send({
            message: 'Kamu harus login terlebih dahulu'
        })
    }
    const token = authorization.split('Bearer ')[1]
    try {
        const id = jwt.verify(token, config.SERVER.secret)
        const user = await UserModel.findOne(id)
        if (!user) {
            return res.status(401).send({
                message: 'Kamu harus login terlebih dahulu'
            })
        }
        req.userId = user.id
        next()
    } catch (error) {
        errorResponse(res, error)
    }
}