const { CommentModel, UserModel, StoryModel } = require("../../database/model/model")
const { errorResponse } = require("../../utils/error_response")
const { offsetPagination, getPaginationData } = require("../../utils/utils")

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
        const getOffset = offsetPagination(page, limit)
        const commentList = await CommentModel.findAndCountAll({
            offset: getOffset.offset,
            limit: getOffset.limit,
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
        const paginationData = getPaginationData(commentList, page, limit)
        let comments = []
        paginationData.list.forEach(item => {
            const isMy = item.toJSON().user.id === req.userId;
            comments.push({ ...item.toJSON(), isMy })
        })
        delete paginationData.list
        const data = {
            ...paginationData,
            comments,
        }
        return res.send({
            message: 'Get comments by story id',
            data,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.deleteComment = async (req, res) => {
    const { commentId } = req.body
    try {
        await CommentModel.destroy({
            where: {
                id: commentId
            }
        })
        return res.send({
            message: 'Komentar berhasil dihapus!'
        })
    } catch (error) {
        errorResponse(res, error)
    }
}