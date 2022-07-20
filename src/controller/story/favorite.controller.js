const FavoriteModel = require("../../database/model/src/story/favorite.model")
const { errorResponse } = require("../../utils/error_response")

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