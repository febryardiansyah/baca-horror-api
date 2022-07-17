const { StoryModel, AuthorModel } = require("../../database/model/model")
const { errorResponse } = require("../../utils/error_response")

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