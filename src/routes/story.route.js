const router = require('express').Router()
const storyRoutes = require('express').Router()
const storyController = require('../controller/story/story.controller')
const { createAuthorMiddleware, createStoryMiddleWare } = require('../middlewares/story/story.middleware')

router.post('/author/create', [createAuthorMiddleware], storyController.createAuthor)
router.get('/author', storyController.getAllAuthor)

router.post('/create',[createStoryMiddleWare], storyController.createStory)
router.get('/all', storyController.getAllStory)

storyRoutes.use('/api/story', router)

module.exports = storyRoutes