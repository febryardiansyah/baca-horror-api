const config = require("../config/config")
const { UserModel } = require("../database/model/model")
const jwt = require('jsonwebtoken')

exports.offsetPagination = (page, limit) => {
    limit = limit ? +limit : 10
    page = page ? page < 1 ? 0 : page - 1 : 0
    const offset = page ? page * limit : 0
    return { limit, offset }
}

exports.getPaginationData = (data, current_page = 1, limit = 10) => {
    const { count: total_items, rows: records } = data;
    const total_pages = Math.ceil(total_items / limit)
    current_page = Number(current_page)

    return { current_page, total_pages, total_items, records }
}

exports.parseJSON = (val) => JSON.parse(JSON.stringify(val))

exports.checkHeaderAuthorization = (req) => {
    const { authorization } = req.headers;

    return authorization;
}

exports.checkUserByToken = async (authorization) => {
    const token = authorization.split('Bearer ')[1]
    const parseToken = jwt.verify(token, config.SERVER.secret)
    const user = await UserModel.findByPk(parseToken.id)

    return user;
}