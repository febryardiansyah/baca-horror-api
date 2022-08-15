exports.errorResponse = (res, error) => {
    console.log(`ERROR ===> ${error} <===`);
    let errors = []
    if (error) {
        if (error.errors) {
            for (const item of error.errors) {
                errors.push(item.message)
            }
            return res.status(400).send({
                message: 'Error',
                errors,
            })
        }
    }
    return res.status(400).send({
        message: error
    })
}