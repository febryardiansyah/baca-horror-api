exports.offsetPagination = (page, size) => {
    const limit = size ? +size : 10
    const offset = page ? page * size : 0
    return { limit, offset }
}