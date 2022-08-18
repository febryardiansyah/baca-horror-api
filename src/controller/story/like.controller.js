const { UserModel, StoryModel, AuthorModel } = require("../../database/model/model");
const LikeModel = require("../../database/model/src/story/like.model");
const { errorResponse } = require("../../utils/error_response");
const sequelize = require('sequelize')

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
            records: stories_like,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getMostLikedStory = async (req, res) => {
    try {
        const stories = await StoryModel.findAll({
            limit: 10,
            subQuery: false,
            include: [
                {
                    model: UserModel,
                    as: 'users_like',
                    attributes: []
                },
                {
                    model: AuthorModel,
                    as: 'author'
                }
            ],
            attributes: {
                include: [
                    // [sequelize.literal('(select count(*) from likes as ul where ul.storyId = Story.id)'), 'total_likes']
                    [sequelize.fn('COUNT', sequelize.col('users_like.id')), 'total_likes']
                ]
            },
            group: ['id'],
            order: [
                [sequelize.literal('total_likes'), 'DESC'],
            ],
        })

        return res.send({
            message: 'Get cerita yang paling disukai',
            records: stories
        })
    } catch (error) {
        errorResponse(res, error)
    }
}