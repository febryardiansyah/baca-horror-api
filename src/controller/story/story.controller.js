const { AuthorModel, StoryModel } = require("../../database/model/model");
const { errorResponse } = require("../../utils/error_response")
const cheerio = require('cheerio');
const { default: axios } = require("axios");
const { parseHTMLContent } = require("../../utils/string");
const { offsetPagination: getPagination, offsetPagination } = require("../../utils/utils");

/**
 * AUTHOR
 */
exports.createAuthor = async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)
        const name = $('body > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > h1').text().split(' ')[2]
        const img = $('body > div.container.narrow.pb-5 > div > div > div.mb-2.d-flex.align-items-center > div:nth-child(1) > img').attr('src')
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
        const authors = await AuthorModel.findAll()
        return res.send({
            message: 'Get semua author berhasil',
            authors
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

/**
 * STORY
 */
exports.createStory = async (req, res) => {
    const { title, url, author_id } = req.body;
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
        const story = await StoryModel.create({
            title, url, author_id, img, synopsis, source, contents,
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
    const { page, limit } = req.query

    try {
        const getPagination = offsetPagination(page, limit)
        const stories = await StoryModel.findAll({
            include: ['author'],
            limit: 3,
            offset: 0,
        })
        return res.send({
            message: 'Get semua cerita berhasil',
            stories,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}

exports.getStoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const story = await StoryModel.scope('with_contents').findByPk(id, {
            include: ['author']
        })
        return res.send({
            message: 'Get Story by id',
            story,
        })
    } catch (error) {
        errorResponse(res, error)
    }
}