const router = require('express').Router()
const userRoutes = require('express').Router()
const userController = require('../controller/user/user.controller')
const { requireToken } = require('../middlewares/story/story.middleware')
const { loginFormMiddleWare } = require('../middlewares/user/user.middleware')

router.post('/register', userController.createUser)
router.post('/login', [loginFormMiddleWare], userController.login)

router.get('/me', [requireToken], userController.getMyProfile)

userRoutes.use('/api/user', router)

module.exports = userRoutes;