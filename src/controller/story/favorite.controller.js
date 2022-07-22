const sequelize = require("sequelize")
const { StoryModel, UserModel } = require("../../database/model/model")
const FavoriteModel = require("../../database/model/src/story/favorite.model")
const { errorResponse } = require("../../utils/error_response")
const { parseJSON } = require("../../utils/utils")

exports.favoriteStory = async (req, res) => {
    const { storyId } = req.body
    try {
        const isFavorite = await FavoriteModel.findOne({
            where: {
                storyId: storyId,
                userId: req.userId
            }
        })
        if (isFavorite) {
            return res.status(400).send({
                message: 'Cerita sudah di favoritkan'
            })
        }
        await FavoriteModel.create({
            storyId: storyId,
            userId: req.userId
        })
        return res.send({
            message: 'Cerita berhasil ditambahkan ke favorite',
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.removeFavorite = async (req, res) => {
    const { storyId } = req.body
    try {
        const isFavorite = await FavoriteModel.findOne({
            where: {
                storyId: storyId,
                userId: req.userId
            }
        })
        if (!isFavorite) {
            return res.status(400).send({
                message: 'Cerita belum di favoritkan'
            })
        }
        await isFavorite.destroy()
        return res.send({
            message: 'Cerita berhasil dihapus dari favorite',
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getMostFavorite = async (req, res) => {
    try {
        let stories = await StoryModel.findAll({
            limit: 10,
            include: [
                'author',
            ],
            attributes: {
                include: [
                    [sequelize.literal('(select count(*) from favorites as fav where fav.storyId = Story.id)'), 'total_favorites'],
                ]
            },
            order: [
                [sequelize.literal('total_favorites'), 'DESC'],
            ]
        })

        return res.send({
            message: 'Get cerita yang paling favorite',
            stories
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getMyFavorite = async (req, res) => {
    try {
        let user = await UserModel.findByPk(req.userId, {
            include: [
                {
                    model: StoryModel,
                    as: 'stories_favorite',
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
        const { stories_favorite } = user;
        return res.send({
            message: 'Get semua cerita favorite berhasil',
            stories_favorite,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}