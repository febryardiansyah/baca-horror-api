exports.offsetPagination = (page, limit) => {
    limit = limit ? +limit : 10
    page = page ? page < 1 ? 0 : page - 1 : 0
    const offset = page ? page * limit : 0
    return { limit, offset }
}

exports.getPaginationData = (data, current_page = 1, limit = 10) => {
    const { count: total_items, rows: list } = data;
    const total_pages = Math.ceil(total_items / limit)
    current_page = Number(current_page)

    return { current_page, total_pages, total_items, list }
}

exports.parseJSON = (val) => JSON.parse(JSON.stringify(val))