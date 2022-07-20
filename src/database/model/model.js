const AuthorModel = require("./src/story/author.model");
const FavoriteModel = require("./src/story/favorite.model");
const LikeModel = require("./src/story/like.model");
const StoryModel = require("./src/story/story.model");
const UserModel = require("./src/user/user.model");

/**
 * AUTHOR
 */
AuthorModel.hasMany(StoryModel, { as: 'stories', foreignKey: 'author_id' })

/**
 * STORY
 */
StoryModel.belongsTo(AuthorModel, { as: 'author', foreignKey: 'author_id' })
StoryModel.belongsToMany(UserModel, { as: 'users_like', through: LikeModel })
StoryModel.belongsToMany(UserModel, { as: 'users_favorite', through: FavoriteModel })

/**
 * USER
 */
UserModel.belongsToMany(StoryModel, { as: 'stories_like', through: LikeModel })
UserModel.belongsToMany(StoryModel, { as: 'stories_favorite', through: FavoriteModel })

module.exports = {
    UserModel,
    AuthorModel,
    StoryModel,
    FavoriteModel,
}