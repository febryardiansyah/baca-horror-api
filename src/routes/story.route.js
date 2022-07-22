const router = require('express').Router()
const storyRoutes = require('express').Router()
const storyController = require('../controller/story/story.controller')
const likeController = require('../controller/story/like.controller')
const favoriteController = require('../controller/story/favorite.controller')
const { createAuthorMiddleware, createStoryMiddleWare, requireToken } = require('../middlewares/story/story.middleware')

// author
router.post('/author/create', [createAuthorMiddleware], storyController.createAuthor)
router.get('/author/all', storyController.getAllAuthor)

// story
router.post('/story/create', [createStoryMiddleWare], storyController.createStory)
router.get('/story/all', storyController.getAllStory)
router.get('/story/:id', storyController.getStoryById)
router.get('/story/contents/:id', [requireToken], storyController.getStoryContents)

// like
router.post('/story/like', [requireToken], likeController.likeStory)
router.post('/story/unlike', [requireToken], likeController.unlikeStory)
router.get('/story/me/liked', [requireToken], likeController.getMyLikedStory)
router.get('/story/most-liked/all', likeController.getMostLikedStory)

//favorite
router.post('/story/favorite', [requireToken], favoriteController.favoriteStory)
router.post('/story/favorite/remove', [requireToken], favoriteController.removeFavorite)
router.get('/story/most-favorite/all',favoriteController.getMostFavorite)
router.get('/story/me/favorite',[requireToken],favoriteController.getMyFavorite)

storyRoutes.use('/api', router)

module.exports = storyRoutes