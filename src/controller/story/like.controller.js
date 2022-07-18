const { UserModel, StoryModel } = require("../../database/model/model");
const LikeModel = require("../../database/model/src/story/like.model");
const { errorResponse } = require("../../utils/error_response");

exports.likeStory = async (req, res) => {
    const { storyId } = req.body;
    if (!storyId) {
        return res.status(400).send({
            message: 'storyId tidak boleh kosong'
        })
    }

    try {
        const likeExist = await LikeModel.findOne({
            where: {
                storyId,
                userId: req.userId
            }
        })
        if (likeExist) {
            return res.status(400).send({
                message: 'Cerita sudah di Like'
            })
        }
        // const user = await UserModel.findByPk(req.userId)
        // const story = await StoryModel.findByPk(storyId)
        // await user.addStory(story, { through: LikeModel })
        await LikeModel.create({ userId: req.userId, storyId: storyId })
        return res.send({
            message: `Berhasil like cerita`
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.unlikeStory = async (req, res) => {
    const { storyId } = req.body;
    if (!storyId) {
        return res.status(400).send({
            message: 'storyId tidak boleh kosong'
        })
    }
    try {
        const isLiked = await LikeModel.findOne({
            where: {
                storyId,
                userId: req.userId
            }
        })
        if (!isLiked) {
            return res.status(400).send({
                message: 'Cerita belum di like'
            })
        }
        await isLiked.destroy()
        return res.send({
            message: 'Cerita berhasil di Unlike'
        })
    } catch (error) {
        errorResponse(res, error)
    }
}