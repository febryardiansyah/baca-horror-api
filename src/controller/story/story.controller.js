const { AuthorModel, StoryModel, UserModel, CommentModel, } = require("../../database/model/model");
const { errorResponse } = require("../../utils/error_response")
const cheerio = require('cheerio');
const { default: axios } = require("axios");
const { parseHTMLContent } = require("../../utils/string");
const { offsetPagination, getPaginationData, checkHeaderAuthorization, checkUserByToken, } = require("../../utils/utils");
const { Op } = require('sequelize');
const sequelize = require("sequelize");
const LikeModel = require("../../database/model/src/story/like.model");
const HistoryModel = require("../../database/model/src/story/history.model");

/**
 * AUTHOR
 */
exports.createAuthor = async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)
        const name = $('body > div:nth-child(6) > div > div:nth-child(2) > div > div.align-self-start.align-self-md-center > div.username > a').attr('href').replace('/user/', '@')
        const img = $('body > div:nth-child(6) > div > div.avatar.align-self-center > img').attr('src')
        const twitter_url = `https://twitter.com/${name.replace('@', '')}`
        const authorExist = await AuthorModel.findOne({
            where: {
                name
            }
        })
        if (authorExist) {
            return res.status(400).send({
                message: `Author sudah terdaftar dengan id: ${authorExist.id}, nama: ${authorExist.name}`
            })
        }

        const author = await AuthorModel.create({
            name,
            img,
            twitter_url,
        })

        return res.send({
            message: 'Author berhasil dibuat!',
            author,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getAllAuthor = async (req, res) => {
    try {
        const authors = await AuthorModel.findAll({
            include: {
                model: StoryModel,
                as: 'stories',
                attributes: []
            },
            attributes: {
                include: [
                    [sequelize.fn('count', sequelize.col('stories.id')), 'total_stories']
                ]
            },
            group: ['author.id']
        })
        return res.send({
            message: 'Get semua author berhasil',
            records: authors
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getAuthorById = async (req, res) => {
    const { id } = req.params
    try {
        const author = await AuthorModel.findByPk(id)
        if (!author) {
            return res.status(404).send({
                message: 'Author tidak ditemukan'
            })
        }

        return res.send({
            message: 'Get author by id success',
            data: author
        })
    } catch (error) {
        errorResponse(error)
    }
}

exports.getStoryByAuthor = async (req, res) => {
    const { id } = req.params
    const { page, limit, } = req.query
    try {
        const getOffset = offsetPagination(page, limit)
        let stories = await StoryModel.findAndCountAll({
            limit: getOffset.limit,
            offset: getOffset.offset,
            where: {
                author_id: id
            },
            order: [
                ['created_at', 'DESC']
            ]
        })
        stories = getPaginationData(stories, page, limit)

        return res.send({
            message: 'Get cerita by author',
            ...stories
        })
    } catch (error) {
        errorResponse(error)
    }
}

/**
 * STORY
 */
exports.createStory = async (req, res) => {
    const { title, url } = req.body;
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)
        const img = $("#tweet_1 > span > a > img").attr('data-src');
        const synopsis = parseHTMLContent($('#tweet_1').text().trim().split('#')[0])
        const source = $('body > div.container.narrow.pb-5 > div > div > div.mb-2.d-flex.align-items-center > div.flex-grow-1 > div > div.d-flex.align-items-center.justify-content-between > div.web-intent > span > a:nth-child(4)').attr('href');
        let contents = []
        $('.content-tweet').each((i, el) => {
            if (i !== 0) {
                contents.push(
                    parseHTMLContent($(el).text().trim())
                )
            }
        })
        const authorName = $('body > div.container.narrow.pb-5 > div > div > div.mb-2.d-flex.align-items-center > div.flex-grow-1 > div > h4 > a').attr('href').replace('/user/', '@')
        const authorExist = await AuthorModel.findOne({
            where: {
                name: authorName,
            }
        })
        let authorId
        if (!authorExist) {
            const img = $('body > div.container.narrow.pb-5 > div > div > div.mb-2.d-flex.align-items-center > div:nth-child(1) > img').attr('src')
            const twitter_url = `https://twitter.com/${authorName.replace('@', '')}`
            const author = await AuthorModel.create({
                name: authorName,
                img,
                twitter_url,
            })
            authorId = author.id
        } else {
            authorId = authorExist.id
        }
        const story = await StoryModel.create({
            title, url, author_id: authorId, img, synopsis, source, contents, total_views: 0,
        })

        return res.send({
            message: 'Cerita berhasil dibuat!',
            story
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getAllStory = async (req, res) => {
    const { page, limit, title } = req.query

    let where = {}

    if (title) {
        where.title = {
            [Op.like]: `%${title}%`
        }
    }
    try {
        const getOffset = offsetPagination(page, limit)
        let stories = await StoryModel.findAndCountAll({
            include: ['author'],
            limit: getOffset.limit,
            offset: getOffset.offset,
            where,
            order: [
                ['created_at', 'DESC']
            ]
        })
        stories = getPaginationData(stories, page, limit)

        return res.send({
            message: 'Get semua cerita berhasil',
            ...stories
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.editStory = async (req, res) => {
    const { id } = req.params
    const { title, img } = req.body
    if (!id) {
        return res.status(400).send({
            message: 'Id tidak boleh kosong'
        })
    }
    if (!title) {
        return res.status(400).send({
            message: 'Title tidak boleh kosong'
        })
    }
    if (!img) {
        return res.status(400).send({
            message: 'Gambar tidak boleh kosong'
        })
    }
    try {
        const story = await StoryModel.findByPk(id)
        if (!story) {
            return res.status(404).send({
                message: 'Cerita tidak ditemukan'
            })
        }
        await story.update({
            title, img
        })
        return res.send({
            message: 'Update Story by id success',
            story
        })
    } catch (error) {
        errorResponse(error)
    }
}

exports.getStoryById = async (req, res) => {
    const { id } = req.params;
    const authorization = checkHeaderAuthorization(req)

    try {
        let userFavoriteWhere;
        let isLiked = false
        // check if authorization not null
        if (!authorization) {
            userFavoriteWhere = null;
        } else {
            const user = await checkUserByToken(authorization)
            if (!user) {
                userFavoriteWhere = null;
            }
            const likes = await LikeModel.findOne({
                where: {
                    userId: user.id,
                    storyId: id
                }
            })
            isLiked = likes !== null
            /// return user.id
            userFavoriteWhere = {
                id: user.id
            }
        }

        let story = await StoryModel.findByPk(id, {
            include: [
                {
                    model: AuthorModel,
                    as: 'author',
                },
                {
                    model: UserModel,
                    as: 'users_favorite',
                    attributes: ['id'],
                    through: {
                        attributes: []
                    },
                    where: userFavoriteWhere,
                    required: false
                },
                {
                    model: UserModel,
                    as: 'users_like',
                    attributes: [],
                }
            ],
            attributes: {
                include: [
                    // [sequelize.literal('(select count(*) from likes as ul where ul.storyId = Story.id)'), 'total_likes'],
                    [sequelize.fn('COUNT', sequelize.col('users_like.id')), 'total_likes']
                ]
            },
            // group: ['users_like.id']
        })
        if (!story) {
            return res.status(404).send({
                message: 'Cerita tidak ditemukan'
            })
        }
        const comments = await CommentModel.findAll({
            where: {
                storyId: id
            }
        })

        await story.update({
            total_views: story.toJSON().total_views + 1
        })
        story = story.toJSON()
        story.isLiked = isLiked
        story.total_commments = comments.length
        story.isFavorite = userFavoriteWhere !== null && story.users_favorite.length > 0

        delete story.users_favorite
        return res.send({
            message: 'Get Story by id',
            data: story,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getStoryContents = async (req, res) => {
    const { id } = req.params
    const userId = req.userId
    try {
        let story = await StoryModel.scope('with_contents').findByPk(id, {
            include: [
                'author',
                {
                    model: UserModel,
                    as: 'users_like',
                    attributes: ['id'],
                    through: {
                        attributes: []
                    },
                    where: {
                        id: userId
                    },
                    required: false,
                },
            ],
            // attributes: {
            //     include: [
            //         [sequelize.literal('(select count(*) from likes as ul where ul.storyId = Story.id)'), 'total_likes'],
            //         [sequelize.fn('COUNT',sequelize.col('users_like.id')),'total_likes']
            //     ]
            // },
        })

        // find all like where storyid
        const likes = await LikeModel.findAll({ where: { storyId: id } })
        
        const history = await HistoryModel.findOne({
            where: {
                userId,
                storyId: id
            }
        })
        if (!history) {
            await HistoryModel.create({ userId, storyId: id })
        } else {
            await history.destroy()
            await HistoryModel.create({ userId, storyId: id })
        }

        story = story.toJSON()
        story.total_likes = likes.length
        story.isLiked = story.users_like.length > 0
        delete story.users_like
        return res.send({
            message: 'Get konten cerita berhasil',
            data: story
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.deleteStoryById = async (req, res) => {
    const { id } = req.params
    try {
        await StoryModel.destroy({ where: { id } })

        return res.send({
            message: `Story dengan id:${id} berhasil dihapus`
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getMostViewStory = async (req, res) => {
    try {
        const records = await StoryModel.findAll({
            limit: 10,
            include: ['author'],
            order: [
                ['total_views', 'DESC']
            ]
        })
        return res.send({
            message: 'Get cerita paling banyak dilihat',
            records,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}