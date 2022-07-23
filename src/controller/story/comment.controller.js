const { CommentModel, UserModel, StoryModel } = require("../../database/model/model")
const { errorResponse } = require("../../utils/error_response")
const { offsetPagination } = require("../../utils/utils")

exports.postComment = async (req, res) => {
    const { message, storyId } = req.body
    const { userId } = req
    if (!message) {
        return res.status(400).send({
            message: 'Komentar tidak boleh kosong'
        })
    }
    try {
        const comment = await CommentModel.create({
            storyId: parseInt(storyId), userId, message
        })
        return res.send({
            message: 'Komen berhasil dibuat',
            comment,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getCommentStoryId = async (req, res) => {
    const { id } = req.params
    const { page, limit } = req.query
    try {
        const offset = offsetPagination(page, limit)
        const data = await CommentModel.findAll({
            offset: offset.offset,
            limit: offset.limit,
            where: {
                storyId: id
            },
            include: [
                {
                    model: UserModel,
                    as: 'user',
                }
            ],
            order: [
                ['created_at', 'DESC']
            ]
        })
        let comments = []
        data.forEach(item => {
            const isMy = item.toJSON().user.id === req.userId;
            comments.push({ ...item.toJSON(), isMy })
        })
        return res.send({
            message: 'Get comments by story id',
            arr: comments,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}