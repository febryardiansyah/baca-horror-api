const AuthorModel = require("./src/story/author.model");
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

/**
 * USER
 */
UserModel.belongsToMany(StoryModel, { as: 'stories_like', through: LikeModel })

module.exports = {
    UserModel,
    AuthorModel,
    StoryModel,
}