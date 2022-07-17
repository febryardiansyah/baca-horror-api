const router = require('express').Router()
const storyRoutes = require('express').Router()
const storyController = require('../controller/story/story.controller')
const { createAuthorMiddleware, createStoryMiddleWare } = require('../middlewares/story/story.middleware')

router.post('/author/create', [createAuthorMiddleware], storyController.createAuthor)
router.get('/author/all', storyController.getAllAuthor)

router.post('/story/create', [createStoryMiddleWare], storyController.createStory)
router.get('/story/all', storyController.getAllStory)

storyRoutes.use('/api', router)

module.exports = storyRoutes