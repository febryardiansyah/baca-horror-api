const { CommentModel, UserModel, StoryModel } = require("../../database/model/model")
const { errorResponse } = require("../../utils/error_response")

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
        // const user = await UserModel.findByPk(userId)
        // const story = await StoryModel.findByPk(storyId)
        // await user.addStory(story, {
        //     through: {
        //         message,
        //     }
        // })
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
    try {
        const comments = await CommentModel.findAll({
            where: {
                storyId: id
            },
            include: [
                {
                    model: UserModel,
                    as: 'user'
                }
            ],
            order: [
                ['created_at','DESC']
            ]
        })
        return res.send({
            message: 'Get comments by story id',
            comments,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}