const router = require('express').Router()
const userRoutes = require('express').Router()
const userController = require('../controller/user/user.controller')
const { requireToken } = require('../middlewares/story/story.middleware')
const { loginFormMiddleWare } = require('../middlewares/user/user.middleware')

router.post('/register', userController.createUser)
router.post('/login', [loginFormMiddleWare], userController.login)
router.post('/verify-email', userController.verifyEmail)

router.get('/me', [requireToken], userController.getMyProfile)
router.put('/me/edit', [requireToken], userController.updateProfile)

userRoutes.use('/api/user', router)

module.exports = userRoutes;