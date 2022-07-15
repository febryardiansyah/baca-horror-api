exports.loginFormMiddleWare = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).send({
            message: 'Email tidak boleh kosong'
        })
    }
    if (!password) {
        return res.status(400).send({
            message: 'Password tidak boleh kosong'
        })
    }
    next()
}