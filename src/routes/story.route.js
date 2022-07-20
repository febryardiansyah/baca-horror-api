const router = require('express').Router()
const storyRoutes = require('express').Router()
const storyController = require('../controller/story/story.controller')
const likeController = require('../controller/story/like.controller')
const { createAuthorMiddleware, createStoryMiddleWare, requireToken } = require('../middlewares/story/story.middleware')

router.post('/author/create', [createAuthorMiddleware], storyController.createAuthor)
router.get('/author/all', storyController.getAllAuthor)

router.post('/story/create', [createStoryMiddleWare], storyController.createStory)
router.get('/story/all', storyController.getAllStory)
router.get('/story/:id', storyController.getStoryById)
router.get('/story/contents/:id', [requireToken], storyController.getStoryContents)

router.post('/story/like', [requireToken], likeController.likeStory)
router.post('/story/unlike', [requireToken], likeController.unlikeStory)
router.get('/story/me/liked', [requireToken], likeController.getMyLikedStory)
router.get('/story/most-liked/all', likeController.getMostLikedStory)

storyRoutes.use('/api', router)

module.exports = storyRoutes