const { UserModel, StoryModel, AuthorModel } = require("../../database/model/model");
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
                message: 'Cerita sudah di Like',
                userId: req.userId,
                likeExist
            })
        }
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

exports.getMyLikedStory = async (req, res) => {
    try {
        let user = await UserModel.findByPk(req.userId, {
            include: [
                {
                    model: StoryModel,
                    as: 'stories_like',
                    through: {
                        attributes: []
                    },
                    include: [
                        'author'
                    ]
                },
            ]
        })
        user = user.toJSON()
        const { stories_like } = user;
        return res.send({
            message: 'Get semua cerita yang disukai berhasil',
            stories_like,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}